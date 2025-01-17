# reservation-backend-v3
NodeJS service providing a backend API for a reservation system for medical providers and clients.

## Documentation

Start the server:

`npm install`

`npm run server`

Run the integration tests (stop the server first if running, with Ctrl-C):

`npm run test`

Endpoints:
### `http://localhost:3000/availability`
- POST: create a new block of available appointments between the `start` and `end` time.
- Example payload:
```json
{
  "start": "2027-01-02T20:00:00+08:00",
  "end": "2027-01-02T20:14:00+08:00",
  "providerName": "Dr. Le"
}
```
Note: `start` and `end` should be ISO 8601 date format with time zone information

### `http://localhost:3000/appointments`
- GET: get a list of available appointments
- Example response:
```json
[
  {
    "id": "c70354ec-873b-4d57-b955-b76f97a34378",
    "providerName": "Future",
    "start": 1798891200,
    "end": 1798892100,
    "created": 1737076414,
    "confirmed": false,
    "reservedBy": null,
    "reservedDate": null
  }
]
```

### `http://localhost:3000/appointments/{APPOINTMENT_ID}/reserve`
- POST: Reserve the appointment with ID `APPOINTMENT_ID` for the user `name`
- Example payload:
```json
{
  "name":"Gary Numan"
}
```

### `http://localhost:3000/appointments/{APPOINTMENT_ID}/confirm`
- POST: Confirm the reservation for appointment with ID `APPOINTMENT_ID`
- Request has no body
