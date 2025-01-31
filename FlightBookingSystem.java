import java.util.*;
 
public class FlightBookingSystem {
    // List to hold available flights
    private static List<Flight> flights = new ArrayList<>();
    // Map to hold customer bookings
    private static Map<String, Booking> bookings = new HashMap<>();
 
    public static void main(String[] args) {
        // Add some sample flights
        addSampleFlights();
 
        // Handle user input for commands
        if (args.length == 0) {
            System.out.println("Please provide a command.");
            return;
        }
 
        String command = args[0];
        switch (command) {
            case "viewFlights":
                viewFlights();
                break;
 
            case "bookFlight":
                if (args.length != 4) {
                    System.out.println("Usage: bookFlight <customer_name> <flight_code> <num_seats>");
                    break;
                }
                String customerName = args[1];
                String flightCode = args[2];
                int numSeats = Integer.parseInt(args[3]);
                bookFlight(customerName, flightCode, numSeats);
                break;
 
            case "viewBooking":
                if (args.length != 2) {
                    System.out.println("Usage: viewBooking <customer_name>");
                    break;
                }
                String name = args[1];
                viewBooking(name);
                break;
 
            default:
                System.out.println("Invalid command. Available commands are: viewFlights, bookFlight, viewBooking.");
        }
    }
 
    // Adds some sample flights to the system
    private static void addSampleFlights() {
        flights.add(new Flight("Flight123", "New York", "Los Angeles", 10));
        flights.add(new Flight("Flight456", "Chicago", "San Francisco", 15));
        flights.add(new Flight("Flight789", "Boston", "Miami", 8));
    }
 
    // Display available flights
    private static void viewFlights() {
        if (flights.isEmpty()) {
            System.out.println("No flights available.");
            return;
        }
        System.out.println("Available Flights:");
        for (Flight flight : flights) {
            System.out.println(flight);
        }
    }
 
    // Book a flight
    private static void bookFlight(String customerName, String flightCode, int numSeats) {
        Flight flight = findFlightByCode(flightCode);
        if (flight == null) {
            System.out.println("Flight not found.");
            return;
        }
        if (flight.getAvailableSeats() < numSeats) {
            System.out.println("Not enough seats available.");
            return;
        }
        flight.setAvailableSeats(flight.getAvailableSeats() - numSeats);
        Booking booking = new Booking(customerName, flightCode, numSeats);
        bookings.put(customerName, booking);
        System.out.println("Booking successful! " + numSeats + " seat(s) booked for " + customerName + " on " + flightCode);
    }
 
    // View booking details
    private static void viewBooking(String customerName) {
        Booking booking = bookings.get(customerName);
        if (booking != null) {
            System.out.println("Booking details for " + customerName + ":");
            System.out.println(booking);
        } else {
            System.out.println("No booking found for " + customerName);
        }
    }
 
    // Helper method to find a flight by code
    private static Flight findFlightByCode(String flightCode) {
        for (Flight flight : flights) {
            if (flight.getFlightCode().equals(flightCode)) {
                return flight;
            }
        }
        return null;
    }
}
 
// Flight class to represent each flight
class Flight {
    private String flightCode;
    private String departure;
    private String arrival;
    private int availableSeats;
 
    public Flight(String flightCode, String departure, String arrival, int availableSeats) {
        this.flightCode = flightCode;
        this.departure = departure;
        this.arrival = arrival;
        this.availableSeats = availableSeats;
    }
 
    public String getFlightCode() {
        return flightCode;
    }
 
    public int getAvailableSeats() {
        return availableSeats;
    }
 
    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }
 
    @Override
    public String toString() {
        return "Flight Code: " + flightCode + ", Departure: " + departure + ", Arrival: " + arrival + ", Available Seats: " + availableSeats;
    }
}
 
// Booking class to represent each customer's booking
class Booking {
    private String customerName;
    private String flightCode;
    private int numSeats;
 
    public Booking(String customerName, String flightCode, int numSeats) {
        this.customerName = customerName;
        this.flightCode = flightCode;
        this.numSeats = numSeats;
    }
 
    @Override
    public String toString() {
        return "Flight: " + flightCode + ", Seats: " + numSeats;
    }
}