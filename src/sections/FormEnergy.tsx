"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, RefreshCw, Download, MapPin, ExternalLink, 
  FileText, Home, DollarSign, Calendar, Zap, TrendingUp, 
  X, Phone, Mail, Upload, Clock, CalendarDays 
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const formSchema = z.object({
  monthlyBillValue: z.number().positive("El valor debe ser mayor a 0"),
  unitKwhValue: z.number().positive("El valor debe ser mayor a 0"),
});

// Appointment form schema
const appointmentSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email es requerido"),
  phone: z.string().min(10, "Teléfono debe tener al menos 10 dígitos").max(15, "Teléfono muy largo"),
  address: z.string().min(5, "Dirección es requerida"),
  appointmentDate: z.date().refine((date) => date, {
    message: "Por favor selecciona una fecha",
  }),
  notes: z.string().optional(),
  file: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface BillingResult {
  totalBill: number;
  baseValue: number;
  addedAmount: number;
  appliedCost: number;
  kwh: number;
}

interface SolarResult {
  precioKWh: number;
  consumodia: number;
  calculoKwp: number;
  wp: number;
  panelCount: number;
  investmentValue: number;
  paybackTime: number;
  totalArea: number;
  systemSizeKwp: number;
}

interface AppointmentData {
  id: string;
  email: string;
  phone: string;
  address: string;
  appointmentDate: Date;
  notes?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  monthlyBill?: number;
  unitKwh?: number;
  solarResult?: SolarResult;
  createdAt: Date;
}

export const FormEnergy = () => {
  const [billingResult, setBillingResult] = useState<BillingResult | null>(null);
  const [solarResult, setSolarResult] = useState<SolarResult | null>(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const DEFAULT_COST = 820;
  const ADDED_PERCENTAGE = 20;
  
  // Constants from Excel
  const PEAK_SUN_HOURS = 4.0;
  const PANEL_POWER = 625.0;
  const PANEL_LENGTH = 2.382;
  const PANEL_WIDTH = 1.134;
  const COST_PER_KWP = 3200000;

  // Form for energy calculation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyBillValue: 0,
      unitKwhValue: DEFAULT_COST,
    },
  });

  // Form for appointment
  const appointmentForm = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  // Load appointments from localStorage on component mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem("solarAppointments");
    if (savedAppointments) {
      try {
        const parsedAppointments = JSON.parse(savedAppointments, (key, value) => {
          if (key === "appointmentDate" || key === "createdAt") {
            return new Date(value);
          }
          return value;
        });
        setAppointments(parsedAppointments);
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    }
  }, []);

  const monthlyBillRaw = form.watch("monthlyBillValue");
  const unitKwhRaw = form.watch("unitKwhValue");

  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString('es-ES');
  };

  const calculateBaseAndAdded = (total: number) => {
    const baseValue = Math.round(total / (1 + ADDED_PERCENTAGE / 100));
    const addedAmount = total - baseValue;
    return { baseValue, addedAmount };
  };

  const monthlyBill = typeof monthlyBillRaw === "string" ? parseFloat(monthlyBillRaw) : monthlyBillRaw ?? 0;
  const unitKwh = typeof unitKwhRaw === "string" ? parseFloat(unitKwhRaw) : unitKwhRaw ?? 0;
  const { baseValue, addedAmount } = calculateBaseAndAdded(monthlyBill);
  const consumoMes = baseValue && unitKwh ? baseValue / unitKwh : 0;

  const onSubmit = (data: FormValues) => {
    const { baseValue, addedAmount } = calculateBaseAndAdded(data.monthlyBillValue);
    const kwh = baseValue / data.unitKwhValue;

    setBillingResult({
      totalBill: data.monthlyBillValue,
      baseValue,
      addedAmount,
      appliedCost: data.unitKwhValue,
      kwh,
    });

    // Solar installation calculations
    const precioKWh = data.unitKwhValue;
    const consumoMes = kwh;
    const consumodia = consumoMes / 30;
    const calculoKwp = consumodia / PEAK_SUN_HOURS;
    const wp = calculoKwp * 1000;
    const panelCount = Math.ceil(wp / PANEL_POWER);
    const investmentValue = calculoKwp * COST_PER_KWP;
    const panelArea = PANEL_LENGTH * PANEL_WIDTH;
    const totalArea = panelArea * panelCount;
    const annualBillWithoutSolar = consumoMes * precioKWh * 12;
    const paybackTime = investmentValue / annualBillWithoutSolar;

    setSolarResult({
      precioKWh,
      consumodia,
      calculoKwp,
      wp,
      panelCount,
      investmentValue,
      paybackTime,
      totalArea,
      systemSizeKwp: calculoKwp
    });
  };

  const handleReset = () => {
    form.reset({
      monthlyBillValue: 0,
      unitKwhValue: DEFAULT_COST,
    });
    setBillingResult(null);
    setSolarResult(null);
  };

  const handleCloseTable = () => {
    setBillingResult(null);
    setSolarResult(null);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  // Open Google Maps with address
  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  // Handle appointment submission
  const onAppointmentSubmit = async (data: AppointmentFormValues) => {
    try {
      const newAppointment: AppointmentData = {
        id: `appt_${Date.now()}`,
        email: data.email,
        phone: data.phone,
        address: data.address,
        appointmentDate: data.appointmentDate,
        notes: data.notes,
        fileName: uploadedFile?.name,
        fileSize: uploadedFile?.size,
        fileType: uploadedFile?.type,
        monthlyBill: monthlyBill,
        unitKwh: unitKwh,
        solarResult: solarResult || undefined,
        createdAt: new Date(),
      };

      // Add to local storage
      const updatedAppointments = [...appointments, newAppointment];
      localStorage.setItem("solarAppointments", JSON.stringify(updatedAppointments));
      setAppointments(updatedAppointments);

      // Prepare data for database submission
      const appointmentForDB = {
        ...newAppointment,
        fileData: uploadedFile ? await fileToBase64(uploadedFile) : null,
        file: undefined // Remove File object for JSON
      };

      // Log to console (simulate sending to database)
      console.log("Appointment data ready for database:", appointmentForDB);

      // Reset form and close dialog
      appointmentForm.reset();
      setUploadedFile(null);
      setIsAppointmentDialogOpen(false);

      // Show success message
      alert("¡Cita agendada exitosamente! Los datos han sido guardados.");
      
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Error al guardar la cita. Por favor intenta nuevamente.");
    }
  };

  // Convert file to base64 for potential database storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Calculate minimum date (7 days from now)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  };

  return (
    <section className="pt-20 pb-20 md:pt-20 md:pb-20 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#0a1832,#1a233a_80%)] text-white">
      <div className="container">
        <div className="mb-8 border border-slate-500 rounded-md p-6 bg-slate-900">
          {/* Form Section */}
          <Card className="border-slate-500 bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-200">
                <Calculator className="h-5 w-5 text-slate-200" />
                Información de Facturación Eléctrica
              </CardTitle>
              {billingResult && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseTable}
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cerrar tabla
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-white text-sm">
                Los resultados son estimaciones aproximadas basadas en los datos ingresados y no constituyen una cotización, propuesta comercial ni oferta vinculante. El número de paneles, costos, ahorros y resultados reales pueden variar según condiciones técnicas, regulatorias y de ubicación.
              </p>

              {/* Input Form Section */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Full width with 2 columns */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* First column: Input with peso sign */}
                    <FormField
                      control={form.control}
                      name="monthlyBillValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Valor Total Factura </FormLabel>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <DollarSign className="h-4 w-4 text-slate-400" />
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Ingrese el valor total de su factura"
                                className="bg-slate-800 border-slate-600 text-white pl-10 h-12 md:text-2xl  font-bold sm:text-sm"
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? 0 : parseFloat(value));
                                }}
                              />
                            </FormControl>
                          </div>
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Second column: Base value display */}
                    <div>
                      <label className="text-slate-300 text-sm font-medium">Valor Base</label>
                      <div className="relative mt-2">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="h-12 p-3 bg-slate-800 border border-slate-600 rounded-md text-white  pl-10 flex items-center md:text-lg  text-sm">
                          {monthlyBill > 0 ? formatNumber(baseValue) : "0"}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">
                        {monthlyBill > 0
                          ? ` $${formatNumber(addedAmount)} - 20% Valor del aporte `
                          : 'Ingrese factura para ver cálculo'}
                      </p>
                    </div>
                  </div>

                  {/* Two columns */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Read-only calculated field with peso sign */}
                    <div>
                      <label className="text-slate-300 text-sm font-medium">Consumo Mes (kWh)</label>
                      <div className="relative mt-2 font-bold ">
                        <Input
                          type="number"
                          value={Math.round(consumoMes)} 
                          readOnly
                          className="bg-slate-800 border-slate-600 text-lime-300 cursor-not-allowed  h-12 pl-3 md:text-2xl sm:text-md sm:pl-10"
                        />
                      </div>
                     
                    </div>

                    {/* Input field with peso sign */}
                    <FormField
                      control={form.control}
                      name="unitKwhValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Valor Unitario kWh</FormLabel>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <DollarSign className="h-4 w-4 text-slate-400" />
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="820"
                                className="bg-slate-800 border-slate-600 text-lime-200  h-12 md:text-lg sm:text-sm pl-10"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 h-12">
                      <Zap className="mr-2 h-4 w-4" />
                      Calcular
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1 bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:text-white h-12"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Limpiar datos
                    </Button>
                  </div>
                </form>
              </Form>

              {/* Billing Results Table */}
              {billingResult && (
                <div className="space-y-6">
                  {/* Solar Installation Results Table */}
                  {solarResult && (
                    <div>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            <h3 className="text-lg font-semibold text-lime-300 mb-4 flex items-center gap-2">
                              <Home className="h-5 w-5 text-lime-300"/>Estimación de Instalación Solar
                            </h3>
                          </AccordionTrigger>
                          <AccordionContent>
                            <Table className="border border-slate-600">
                              <TableHeader>
                                <TableRow className="border-slate-600 hover:bg-slate-800">
                                  <TableHead className="text-slate-600">Parámetro</TableHead>
                                  <TableHead className="text-right text-slate-600">Valor</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow className="border-slate-600 hover:bg-slate-800">
                                  <TableCell className="text-slate-300">Consumo Diario</TableCell>
                                  <TableCell className="text-right text-slate-200 font-semibold">
                                    {solarResult.consumodia.toFixed(2)} kWh/día
                                  </TableCell>
                                </TableRow>
                                <TableRow className="border-slate-600 hover:bg-slate-800">
                                  <TableCell className="text-slate-300">Tamaño del Sistema</TableCell>
                                  <TableCell className="text-right text-slate-200 font-semibold">
                                    {solarResult.calculoKwp.toFixed(2)} kWp
                                  </TableCell>
                                </TableRow>
                                <TableRow className="border-slate-600 hover:bg-slate-800">
                                  <TableCell className="text-slate-300">Número de Paneles (625W)</TableCell>
                                  <TableCell className="text-right text-slate-200 font-semibold">
                                    {solarResult.panelCount} paneles
                                  </TableCell>
                                </TableRow>
                                <TableRow className="border-slate-600 hover:bg-slate-800">
                                  <TableCell className="text-slate-300">Área Requerida</TableCell>
                                  <TableCell className="text-right text-slate-200 font-semibold">
                                    {solarResult.totalArea.toFixed(2)} m²
                                  </TableCell>
                                </TableRow>
                                <TableRow className="border-slate-600 hover:bg-slate-800">
                                  <TableCell className="text-slate-300">Inversión Estimada</TableCell>
                                  <TableCell className="text-right text-slate-200 font-semibold">
                                    ${formatNumber(solarResult.investmentValue)} COP
                                  </TableCell>
                                </TableRow>
                                <TableRow className="border-slate-600 hover:bg-slate-800">
                                  <TableCell className="text-slate-300">Retorno de Inversión</TableCell>
                                  <TableCell className="text-right text-slate-200 font-semibold">
                                    {solarResult.paybackTime.toFixed(2)} años
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Accordion type="single" collapsible>
                        <div className="mt-4 p-4 bg-slate-800 rounded-md border border-slate-600">
                          <AccordionItem value="item-1">
                            <AccordionTrigger>
                              <h4 className="font-semibold text-slate-300">Detalles del Cálculo:</h4>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="text-sm text-slate-400 space-y-1">
                                <li>• Horas Sol Pico (HSP): {PEAK_SUN_HOURS} horas</li>
                                <li>• Potencia por Panel: {PANEL_POWER}W</li>
                                <li>• Dimensiones del Panel: {PANEL_LENGTH}m × {PANEL_WIDTH}m</li>
                                <li>• Área por Panel: {(PANEL_LENGTH * PANEL_WIDTH).toFixed(2)}m²</li>
                                <li>• Costo por kWp instalado: ${COST_PER_KWP.toLocaleString('es-ES')} COP</li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </div>
                      </Accordion>

                      <p className="text-xs text-slate-400 mt-4">
                        <strong>Nota:</strong> Estas son estimaciones aproximadas. Los valores reales pueden variar según la ubicación, condiciones técnicas y regulatorias locales. Se recomienda un estudio técnico profesional para una evaluación precisa.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Appointment Section */}
        <div id="layout content">
          <Card className="border-slate-500 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-200">
                <CalendarDays className="h-5 w-5" />
                Agenda una Cita Personalizada
              </CardTitle>
              <p className="text-slate-300 text-sm">
                ¿Quieres una evaluación más detallada de tu proyecto solar? Agenda una cita con nuestros especialistas.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lime-300 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Beneficios de agendar una cita:
                    </h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Análisis personalizado de tu consumo energético</li>
                      <li>• Evaluación exacta de tu techo/espacio disponible</li>
                      <li>• Cotización precisa con componentes específicos</li>
                      <li>• Asesoría sobre incentivos y financiamiento</li>
                      <li>• Plan de instalación y mantenimiento</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lime-300 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Lo que necesitamos:
                    </h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Información de contacto para coordinar</li>
                      <li>• Dirección exacta de la propiedad</li>
                      <li>• Tu factura de energía (opcional)</li>
                      <li>• Preferencia de fecha y hora</li>
                      <li>• Cualquier requerimiento especial</li>
                    </ul>
                  </div>
                </div>

                {/* Appointment Dialog Trigger */}
                <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white h-12 text-lg"
                      onClick={() => setIsAppointmentDialogOpen(true)}
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Agendar Cita de Evaluación
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-600 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />
                        Agendar Cita de Evaluación Solar
                      </DialogTitle>
                      <DialogDescription className="text-slate-300">
                        Completa el formulario para programar una cita con nuestros especialistas. 
                        Nos pondremos en contacto para confirmar los detalles.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...appointmentForm}>
                      <form onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)} className="space-y-6">
                        {/* Email */}
                        <FormField
                          control={appointmentForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="tu@email.com"
                                  className="bg-slate-800 border-slate-600 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Phone */}
                        <FormField
                          control={appointmentForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200 flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Teléfono de Contacto
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+57 300 123 4567"
                                  className="bg-slate-800 border-slate-600 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Address with Google Maps button */}
                        <FormField
                          control={appointmentForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Dirección de la Propiedad
                              </FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input
                                    placeholder="Calle 123 #45-67, Ciudad"
                                    className="bg-slate-800 border-slate-600 text-white flex-1"
                                    {...field}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="border-slate-600"
                                  onClick={() => field.value && openGoogleMaps(field.value)}
                                  disabled={!field.value}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                              <FormDescription className="text-slate-400">
                                Esta dirección será usada para evaluar tu ubicación en Google Maps
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* File Upload */}
                        <div className="space-y-2">
                          <Label className="text-slate-200 flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Factura de Energía (Opcional)
                          </Label>
                          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="file-upload"
                            />
                            <Label
                              htmlFor="file-upload"
                              className="cursor-pointer flex flex-col items-center gap-2"
                            >
                              <Upload className="h-8 w-8 text-slate-400" />
                              <span className="text-sm text-slate-300">
                                {uploadedFile 
                                  ? `Archivo seleccionado: ${uploadedFile.name}`
                                  : "Arrastra o haz clic para subir tu factura"}
                              </span>
                              <span className="text-xs text-slate-400">
                                PDF, JPG, PNG (Máx. 10MB)
                              </span>
                            </Label>
                          </div>
                        </div>

                        {/* Appointment Date */}
                        <FormField
                          control={appointmentForm.control}
                          name="appointmentDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-slate-200 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Fecha Preferida para la Cita
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full pl-3 text-left font-normal bg-slate-800 border-slate-600 hover:bg-slate-700"
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP", { locale: es })
                                      ) : (
                                        <span className="text-slate-400">Selecciona una fecha</span>
                                      )}
                                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => 
                                      date < getMinDate() || date < new Date()
                                    }
                                    initialFocus
                                    className="bg-slate-800 text-white"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription className="text-slate-400">
                                Las citas están disponibles a partir de 7 días desde hoy
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Notes */}
                        <FormField
                          control={appointmentForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-200">
                                Notas Adicionales (Opcional)
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Comparte cualquier información adicional o requerimientos especiales..."
                                  className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAppointmentDialogOpen(false)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Confirmar Cita
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                {/* Appointment Counter */}
                <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Citas agendadas este mes:</p>
                      <p className="text-2xl font-bold text-lime-300">{appointments.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-300">Próxima cita disponible:</p>
                      <p className="text-lg font-semibold text-white">
                        {getMinDate().toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};