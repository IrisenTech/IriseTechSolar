'use client'
import React, { ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface PopOverProps {
  trigger?: ReactNode
  title?: string
  description?: string
  widthClass?: string
  children?: ReactNode
  asChildTrigger?: boolean
}

const PopOver: React.FC<PopOverProps> = ({
  trigger,
  title = 'Options',
  description,
  widthClass = 'w-80',
  children,
  asChildTrigger = false,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild={asChildTrigger}>
        {trigger ?? (
          <Button size="sm" className="bg-black text-white hover:bg-gray-800 text-xs h-7 px-3">
            Edit Info
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className={`${widthClass} bg-black text-white text-sm`} align="start">
        <div className="grid gap-4">
          {title && (
            <div className="space-y-2">
              <h4 className="leading-none font-medium">{title}</h4>
              {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
          )}

          <div className="grid gap-2">
            {children ?? (
              <>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Clase</Label>
                  <Input id="width" defaultValue="Residencial" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxWidth">Estrato</Label>
                  <Input id="maxWidth" defaultValue="5" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="height">Carga</Label>
                  <Input id="height" defaultValue="6.62" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxHeight">Sub Clase</Label>
                  <Input id="maxHeight" defaultValue="Basica" className="col-span-2 h-8" />
                </div>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PopOver
