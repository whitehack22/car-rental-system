import express from "express";
import customer from "./customer/customer.route";
import location from "./location/location.route";
import car from "./car/car.route";
import booking from "./booking/booking.route";
import insurance from "./insurance/insurance.route";
import maintenance from "./maintenance/maintenance.route";
import payment from "./payment/payment.route";
import reservation from "./reservation/reservation.route";

const app = express();
const port = 3000;

//middleware
app.use(express.json());

//route
customer(app);
location(app);
car(app);
booking(app);
insurance(app);
maintenance(app);
payment(app);
reservation(app);


app.get('/', (req, res) => {
  res.send('Hello Express!')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})