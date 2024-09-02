export const fetchMusic = async () => {
  const response = await fetch("/music");

  return await response.json();
};
