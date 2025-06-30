import { useState, useEffect } from "react";

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const targetDate = new Date("2025-07-10T00:00:00-07:00").getTime(); // July 10th midnight Pacific time

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex justify-center space-x-8 space-y-5 mb-8 text-gray-300">
            <div className="text-center">
                <div className="text-5xl md:text-9xl font-bold font-mono">
                    <span className="nabla-text">
                        {timeLeft.days.toString().padStart(2, "0")}
                    </span>
                </div>
                <div className="text-sm md:text-base uppercase tracking-wider invisible">
                    Days
                </div>
            </div>
            <div className="text-center">
                <div className="text-5xl md:text-9xl font-bold font-mono">
                    <span className="nabla-text">
                        {timeLeft.hours.toString().padStart(2, "0")}
                    </span>
                </div>
                <div className="text-sm md:text-base uppercase tracking-wider invisible">
                    Hours
                </div>
            </div>
            <div className="text-center">
                <div className="text-5xl md:text-9xl font-bold font-mono">
                    <span className="nabla-text">
                        {timeLeft.minutes.toString().padStart(2, "0")}
                    </span>
                </div>
                <div className="text-sm md:text-base uppercase tracking-wider invisible">
                    Seconds
                </div>
            </div>
            <div className="text-center">
                <div className="text-5xl md:text-9xl font-bold font-mono">
                    <span className="nabla-text">
                        {timeLeft.seconds.toString().padStart(2, "0")}
                    </span>
                </div>
                <div className="text-sm md:text-base uppercase tracking-wider invisible">
                    Seconds
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;
