import DEFAULT_SETUP from "../_setup.json";

const storageSetupItem = "lukonicaSetup";
const storedSetupRaw = sessionStorage.getItem(storageSetupItem);
const storedSetup = storedSetupRaw ? JSON.parse(storedSetupRaw) : null;
const initialSetup = {};

export const getStoredSetup = () => {
  DEFAULT_SETUP.forEach((item) => {
    initialSetup[item.id] = storedSetup ? storedSetup[item.id] : item.value;
  });
  
  console.warn(initialSetup);
  return initialSetup;
}

export const storeSetup = (nextSetup) => {
  sessionStorage.setItem(storageSetupItem, JSON.stringify(nextSetup));
};
