export const generateRandomColor = () => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B739",
    "#52B788",
    "#E76F51",
    "#2A9D8F",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const generateRandomUsername = () => {
  const adjectives = [
    "Happy",
    "Clever",
    "Brave",
    "Swift",
    "Calm",
    "Bright",
    "Bold",
    "Kind",
  ];
  const nouns = [
    "Panda",
    "Tiger",
    "Eagle",
    "Dolphin",
    "Fox",
    "Wolf",
    "Bear",
    "Lion",
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);

  return `${adjective}${noun}${number}`;
};

export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
