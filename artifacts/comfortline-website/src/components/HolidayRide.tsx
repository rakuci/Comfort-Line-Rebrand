import "./holiday-ride.css";

export function HolidayRide() {
  return (
    <div className="holiday-sky" aria-hidden="true">
      <div className="holiday-snow holiday-snow-far" />
      <div className="holiday-snow holiday-snow-near" />
      <div className="holiday-flight">
        <div className="holiday-carriage">
          <img src="/holiday-sleigh.webp" alt="" width="760" height="380" decoding="async" />
          <span className="holiday-lights" />
        </div>
      </div>
    </div>
  );
}
