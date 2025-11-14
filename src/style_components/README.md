## Make your custom to global import
example you global name: @tnbt-style-custom
1. vite.config.ts

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tnbt-style-custom": path.resolve(__dirname, "./src/style_components/StyleComponents"),
    },
  },

2. tsconfig.json
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@tnbt-style-custom": ["./src/style_components/StyleComponents"]
    }
  }

3. tsconfig.app.json

  "compilerOptions": {
    ...
    "paths": {
      "@/*": ["./src/*"],
      "@tnbt-style-custom": ["./src/style_components/StyleComponents"]
    },
  }
