import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	screens: {
  		sm: '375px',
  		md: '768px',
  		lg: '1200px'
  	},
  	extend: {
  		container: {
  			center: true,
  			padding: {
  				DEFAULT: '20px',
  				lg: '80px'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		// Add textShadow configuration here
  		textShadow: {
  			sm: '0 0 5px var(--tw-shadow-color)',
  			md: '0 0 10px var(--tw-shadow-color)',
  			lg: '0 0 20px var(--tw-shadow-color)',
  			neon: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 80px #ff00ff',
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add the text shadow plugin
    require('tailwindcss/plugin')(function({ addUtilities, theme }: { addUtilities: any; theme: any }) {
      const textShadows = theme('textShadow', {});
      const newUtilities: any = {};
      Object.keys(textShadows).forEach((key: string) => {
        newUtilities[`.text-shadow-${key}`] = {
          textShadow: textShadows[key],
        };
      });
      addUtilities(newUtilities, ['responsive', 'hover']);
    }),
  ],
};

export default config;