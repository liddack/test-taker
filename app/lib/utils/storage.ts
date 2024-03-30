export const saveOnLocalStorage = (keyName: string, value: any) => {
  localStorage.setItem(keyName, JSON.stringify(value));
};

export const readFromLocalStorage = (keyName: string) => {
  try {
    console.log();
    const data = JSON.parse(localStorage.getItem(keyName) || "[]");
    return data;
  } catch (error) {
    throw error;
  }
};
