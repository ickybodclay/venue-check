export function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function overlap(startDateA, endDateA, startDateB, endDateB) {
  return (
    endDateB.getTime() > startDateA.getTime() &&
    startDateB < endDateA.getTime()
  );
}
