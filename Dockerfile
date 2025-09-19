# frontend/Dockerfile
FROM node:20-alpine
WORKDIR /app

# Install dependencies (including dev) so vite is available
COPY package*.json ./
RUN npm ci

# Copy source and ensure local binaries (vite) are on PATH
COPY . .
ENV PATH="/app/node_modules/.bin:${PATH}"

# Expose Vite port used in compose
EXPOSE 5173

# Start the preview/dev server on 0.0.0.0:5173
# Use the script that exists in package.json (preview or dev)
# For preview:
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
# Or, if using dev:
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
