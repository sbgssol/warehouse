import { useEffect, useState } from "react";
import GlobalStrings from "../types/Globals";
import { ReadCsvToStrArr } from "../types/ReadCsv";
const Excel = () => {
  const [csvContent, setCsvContent] = useState<string[]>([]);
  const [codeList, setCodeList] = useState<Set<string>>(new Set());
  const [productMap, setProductMap] = useState<Map<string, { name: string; unit: string }>>(new Map());
  const [selected, setSelected] = useState("");

  const fetchCsvFile = async () => {
    const data = await ReadCsvToStrArr(GlobalStrings.ProductCodeFileName);
    setCsvContent(data);
  };
  useEffect(() => {
    fetchCsvFile();

    return () => {};
  }, []);

  useEffect(() => {
    if (csvContent) {
      let updatedCodeList = new Set(codeList); // Create a new set to store updated codeList
      let updatedProductMap = new Map(productMap); // Create a new map to store updated productMap

      for (let i = 1; i < csvContent.length; ++i) {
        if (csvContent[i].length < 3) continue;
        let line = csvContent[i].split(",");
        let code = line[0].trim();
        let name = line[1].trim();
        let unit = line[2].trim();

        updatedCodeList.add(code); // Add code to updatedCodeList
        updatedProductMap.set(code, { name, unit }); // Add code and its details to updatedProductMap
      }

      // Update the state with the final values
      setCodeList(updatedCodeList);
      setProductMap(updatedProductMap);
    }
  }, [csvContent]); // Run this effect only when csvContent changes

  useEffect(() => {
    console.log(codeList);
  }, [codeList]);

  // Event handler for select change
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
  };

  const loaded = () => {
    if (csvContent) {
      return (
        <>
          <div>
            <pre>{csvContent}</pre>
            <pre>{Array.from(codeList).toString()}</pre>
            <select onChange={handleSelectChange} value={selected}>
              <option value="">Select an option</option>
              {Array.from(codeList).map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <p>Selected: {selected}</p>
            <p>Name: {productMap.get(selected)?.name}</p>
            <p>Unit: {productMap.get(selected)?.unit}</p>
          </div>
        </>
      );
    } else {
      return <></>;
    }
  };

  return <>{loaded()}</>;
};

export default Excel;
