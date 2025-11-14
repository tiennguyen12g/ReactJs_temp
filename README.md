### Initial install
1. npm install tailwindcss @tailwindcss/vite @headlessui/react @heroicons/react
2. npm i i18n 
3. npm i sass classnames
4. npm i axios
5. npm i zustand
6. npm i react-icons
7. npm i @tanstack/react-query
8. npm i clsx
Full: npm install tailwindcss @tailwindcss/vite @headlessui/react @heroicons/react i18n sass classnames axios zustand react-icons @tanstack/react-query clsx



### Vite config
import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

## tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
    "compilerOptions": {
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  }
}
### index.css
@import "tailwindcss";
@import "tw-animate-css";
### Reference
1. seraui.com
npx seraui@latest init
npm install framer-motion
- Model dialog
npx shadcn@latest add "https://seraui.com/registry/modal.json"
npx shadcn@latest add "https://seraui.com/registry/button.json"
npx shadcn@latest add "https://seraui.com/registry/toast.json"
2. https://ui.shadcn.com/
3. https://flowbite.com/docs/components/spinner/
3. 

