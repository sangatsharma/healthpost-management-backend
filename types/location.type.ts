type MunicipalityList = {
  id: number,
  name: string
}

type DistrictList = {
  id: number,
  name: string,
  municipalityList: MunicipalityList
}

type ProvinceList = {
  id: number,
  name: string,
  districtList: DistrictList
}

export default ProvinceList;
