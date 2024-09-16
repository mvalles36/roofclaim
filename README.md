# RoofCare Assist

## Project Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   VITE_SUPABASE_PROJECT_URL=your_supabase_project_url
   VITE_SUPABASE_API_KEY=your_supabase_api_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_MELISSA_DATA_API_KEY=your_melissa_data_api_key
   VITE_ROBOFLOW_API_KEY=your_roboflow_api_key
   ```

## Running the Application

To start the development server:

```
npm run dev
```

## Seeding the Database

To populate the database with sample data:

1. Ensure your Supabase credentials are correctly set in the `.env` file.
2. Run the seeding script:
   ```
   npm run seed
   ```

This will create sample users, customers, jobs, invoices, and supplements in your Supabase database.

## Building for Production

To create a production build:

```
npm run build
```

## Additional Information

For more details on the project structure and components, please refer to the source code and comments within the files.
