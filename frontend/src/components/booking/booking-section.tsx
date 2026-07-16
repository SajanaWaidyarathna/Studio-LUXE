import BookingForm from "./booking-form";
import { getServices } from "@/services/service-api";

export default async function BookingSection() {
  // Fetch services on the server securely
  const services = await getServices();

  return (
    <section
      id="booking"
      className="relative overflow-hidden bg-[#FAF7F2] py-28 lg:py-36"
    >
      {/* Ambient Background decorations */}
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#C9A227]/10 blur-[120px]" />
      <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#D8B4A0]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="flex items-center justify-center gap-4 text-sm uppercase tracking-[0.4em] text-[#C9A227]">
            <span className="h-px w-8 bg-[#C9A227]"></span>
            Booking
            <span className="h-px w-8 bg-[#C9A227]"></span>
          </p>

          <h2 className="mt-6 text-4xl font-light tracking-tight text-[#1C1C1C] md:text-5xl lg:text-6xl">
            Reserve Your <br className="md:hidden" />
            <span className="font-semibold italic text-[#C9A227]">Appointment</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Book your preferred luxury service in just a few steps. 
            We'll take care of the rest.
          </p>
        </div>

        {/* Pass the fetched services to the form as a prop. 
          The fallback "|| []" ensures it never passes undefined.
        */}
        <BookingForm services={services || []} />

      </div>
    </section>
  );
}