import { ProvinceList } from "@app/types/index.type";
import fs from "fs";
import path from "path";

class LocationHelper {
  private static data: { provinceList: ProvinceList[] };

  static get locationData() {
    if (!this.data) {
      const data = fs.readFileSync(path.join(__dirname, "../assets/location.json"), "utf8");
      this.data = JSON.parse(data);
    }

    return this.data;
  }
}

export default LocationHelper;
