const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/Auth');
const patientRoutes = require('./routes/PatientRoute');
const dietChartRoutes = require('./routes/Diet');
const mealTaskRoutes = require('./routes/Meal');
const PantryRoute = require('./routes/PantryRoutes');
const DeliveryPersonnel = require('./routes/DeliveryPerson')

connectToMongo();
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // Authentication Routes
app.use('/api/patients', patientRoutes); // Patient CRUD Operations Routes
app.use('/api/dietCharts', dietChartRoutes); // Diet Chart CRUD Operations Routes
app.use('/api/mealTasks', mealTaskRoutes); // Meal Tasks Routes (Prepare/Delivery)
app.use('/api/pantry', PantryRoute); // Pantry Staff Routes
app.use('/api/deliveryPersonnel', DeliveryPersonnel); // Delivery Personnel Routes


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
