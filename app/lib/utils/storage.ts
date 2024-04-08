export const saveOnLocalStorage = (keyName: string, value: any) => {
  localStorage.setItem(keyName, JSON.stringify(value));
};

export const readFromLocalStorage = (keyName: string, defaultValue: any = "[]") => {
  try {
    console.log();
    const data = JSON.parse(localStorage.getItem(keyName) || defaultValue);
    return data;
  } catch (error) {
    throw error;
  }
};
