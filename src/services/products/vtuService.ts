
// Main export file to maintain backward compatibility
import { getVtuProducts, getVtuProductsByCategory } from "./vtu/queries";
import { buyVtuProduct } from "./vtu/transactions";
import { topUpAirtime } from "./vtu/api";

export {
  getVtuProducts,
  getVtuProductsByCategory,
  buyVtuProduct,
  topUpAirtime
};
