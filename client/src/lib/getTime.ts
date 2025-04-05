export const formatTime = (timestamp: string | number | Date): string => {
    const now = new Date();
    const givenTime = new Date(timestamp);
    const diffMs = now.getTime() - givenTime.getTime();
  
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (seconds < 60) {
      return "Just now";
    } else if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (days <= 3) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      const date = givenTime.getDate();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[givenTime.getMonth()];
      const year = givenTime.getFullYear();
  
      const getOrdinal = (d: number) => {
        if (d > 3 && d < 21) return "th";
        const lastDigit = d % 10;
        return ["st", "nd", "rd"][lastDigit - 1] || "th";
      };
  
      return `${date}${getOrdinal(date)} ${month}, ${year}`;
    }
  };