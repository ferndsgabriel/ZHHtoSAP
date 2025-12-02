import { useEffect, useRef, useState, type FormEvent } from 'react';
import './App.css'
import Input from './components/ui/Input';
import Button from './components/ui/Button';
import { MdContentCopy,  MdOutlineCleaningServices } from "react-icons/md";
import { FaAngleDoubleDown } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


interface brZhh {
  "Article": string;
  "OldArticle": string;
  "Type": string;
  "IsCalibrated": string;
  "DescriptionBr": string;
  "DescriptionEn": string;
  "Items": string;
  "NCM": string;
  "IsKit": string;
  "Supplier": string;
  "BasePriceFromItems": string;
  "PurchasePrice": string;
  "RdServicePrice": string;
  "PriceList": string;
  "Volume": string;
  "GrossWeight": string;
  "NetWeight": string;
  "Item1": string;
  "Price1": string;
  "PuchasePrice1": string;
  "Qtd1": string;
  "Volume1": string;
  "GrossWeight1": string;
  "NetWeight1": string;
  "DeviceLength"?: string; 
  "DeviceWidth"?: string;  
  "DeviceHeight"?: string; 
}

interface sapTemplate{
  SAPdata: number; 
  RleaseGlobal: string;
  DescriptionEn: string;
  DescriptionBr: string;
  SAPMaterial: string;
  OldERP: string;
  MaterialComponents: string;
  QuantityComponents: number; 
  Certificate: string;
  Measure: string;
  Weight: string;
  Length: string;
  Width: string;
  Height: string;
  IFMlabel: string;
  CountryOrigin: string;
  NCM: string;
  Supplier: string;
  SAPsupplier: number; 
  DeliveryTime: number; 
  TaxCode: number; 
  PuchasePrice: string;
  Currency: string;
  StandardPrice: string;
  CommodityCode: string;
  BaseSalesPrice: string;
  CountryCurrency: string;
  SSE: string;
  MaterialGroup: number | null; 
  MRPindicator: string;
  ROCP: string;
  ReleasedCustomer: string;
  SalesText: string;
  BasicDataText: string;
  Warranty: string;
  DiscountGroup: string;
}

interface sharePoint {
  ZHH:string;
  ItemType:string;
  ProductManagement:string;
  Items:string;
  Description:string;
  Old:string;
}

interface suppliersProps{
  Name:string;
  vendor:number
}

const suppliers: suppliersProps[] = [
  { Name:'BEVER', vendor:1039963 },
  { Name:'Vibmaster', vendor:5435164 },
  { Name:'Andreassa', vendor:1034087 },
  { Name:'AT4', vendor:1042635 },
  { Name:'Imediato', vendor:1041806 },
  { Name:'LGM', vendor:1035303 },
  { Name:'MATH TECNOLOGIA', vendor:1035364 }
];

// Estado inicial vazio para ZHH
const initialZhhState: brZhh[] = [{
  Article:'', OldArticle:'', Type:'', IsCalibrated:'', DescriptionBr:'', DescriptionEn:'', Items:'', NCM:'', IsKit:'', Supplier:'',
  BasePriceFromItems:'', PurchasePrice:'', RdServicePrice:'', PriceList:'', Volume:'', GrossWeight:'', NetWeight:'',
  Item1:'', Price1:'', PuchasePrice1:'', Qtd1:'', Volume1:'', GrossWeight1:'', NetWeight1:'',
  DeviceLength:'', DeviceWidth:'', DeviceHeight:''
}];

function App() {
  const [zhh, setZhh] = useState<brZhh[]>(initialZhhState);
  const [sap, setSap] = useState<sapTemplate[] | null>(null);
  const [sharePoint, setSharePoint] = useState<sharePoint[] | null>(null);
  const [example, setExample] = useState(0);
  const tdRef = useRef<HTMLTableCellElement>(null);
  const [typesList, setTypesList] = useState<string[]>([]);
  const [currentTypeList, setCurrentTypeList] = useState<string>(''); 
  
  useEffect(() => {
    tdRef.current?.focus();
  }, []);

  const [currentSupplier, setCurrentSupplier] = useState<suppliersProps>(suppliers[0]);


  const handlePaste = (e: React.ClipboardEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const rows = text.split("\n")
    .filter(row => row.trim() !== '') 
    .map(row => row.split("\t"));
    
    let zhhList:brZhh[] = [];

    rows.forEach((row) => {
      zhhList.push({
        Article: row[0] || '', OldArticle: row[1] || '', Type: row[2] || '',
        IsCalibrated: row[3] || '', DescriptionBr: row[4] || '', DescriptionEn: row[5] || '',
        Items: row[6] || '', NCM: row[7] || '', IsKit: row[8] || '', Supplier: row[9] || '',
        BasePriceFromItems: row[10] || '', PurchasePrice: row[11] || '', RdServicePrice: row[12] || '',
        PriceList: row[13] || '', Volume: row[14] || '', GrossWeight: row[15] || '', NetWeight: row[16] || '',
        Item1: row[17] || '', Price1: row[18] || '', PuchasePrice1: row[19] || '', Qtd1: row[20] || '',  
        Volume1: row[21] || '', GrossWeight1: row[22] || '', NetWeight1: row[23] || '',
        DeviceLength: row[24] || '', DeviceWidth: row[25] || '', DeviceHeight: row[26] || ''
      });
    });
    
    setZhh(zhhList);
    setSap(null);
    setSharePoint(null);
    setTypesList([]);
    setCurrentTypeList('');
  };

  function formatNumber(str: any): string { 
    if (typeof str === 'undefined' || str === null || str === '') {
      return ''; 
    }
    const stringValue = String(str); 
    return stringValue
      .replace(/[^0-9.,]/g, '')  
      .replace(',', '.');        
  }

  const getSDMaterialGroup = (type:string): number | null => {
    if (!type) return null;

    const formatType = type.trim();

    const find: Record<string, number> = {
      "Acessório":110010, "Vibração":210010, "Umidade":205050, "Ultrassônico":106010,
      "Temperatura":203010, "Temperatura TW":203010, "TAG":502010, "RFID":502010,
      "Pressão":202010, "Partículas":200010, "Nível LM/LI":310010, "Nível LW/R/K/T":310010,
      "Módulo":102010, "Magnético":102010, "Indutivo":100010, "Inclinação":600010,
      "Fotoelétrico":104010, "Fluxo":201010, "Fluxo SM/U":201010, "Encoder":105010,
      "Distância":104040, "Controle":300010, "Condutividade":205010, "Capacitivo":103010,
      "Cabos/Conectores":330010, "Safety":320010, "As-i Interface ":320000
    }

    if (find[formatType]) {
      return find[formatType];
    }else{
      toast.warning(`SD Material Group for type "${type}" not found`);
      return null;
    }
  }

  const numberToInt = (num: any) => {
    const value = Number(num);
    if (isNaN(value) || value <= 0) return '"-"'; 
    const tenPercent = value + value * 0.1;
    return Math.round(tenPercent);
  };


  const generateSAPtemplate = (): sapTemplate[] => {
    const sapList: sapTemplate[] = [];

    if (!zhh.length) return [];


    zhh.forEach((item, index) => {
      const isKitComponents = String(item.Items || "").split("-").filter(Boolean);
      
      const deviceLengthNum = parseFloat(item.DeviceLength || '0');
      const deviceWidthNum = parseFloat(item.DeviceWidth || '0');
      const deviceHeightNum = parseFloat(item.DeviceHeight || '0');

      sapList.push({
        SAPdata: index === 0 ? example : example + index, 
        RleaseGlobal: 'no',
        DescriptionEn: item.DescriptionEn,
        DescriptionBr: item.DescriptionBr,
        SAPMaterial: item.Article,
        OldERP: '',
        MaterialComponents: item.Item1,
        QuantityComponents: parseInt(item.Qtd1 || '0') || 1, 
        Certificate: item.IsCalibrated.toLowerCase() === 'y' ? 'YES' : 'NO', 
        Measure: 'PC',
        Weight: item.NetWeight1,
        Length: String(numberToInt(deviceLengthNum)), 
        Width: String(numberToInt(deviceWidthNum)),
        Height: String(numberToInt(deviceHeightNum)),
        IFMlabel: "YES - LABEL FROM SUPPLIER",
        CountryOrigin: 'BR',
        NCM: item.NCM,
        Supplier: currentSupplier.Name,
        SAPsupplier: currentSupplier.vendor,
        DeliveryTime: item.IsCalibrated.toLowerCase() === 'y' ? 15 : 5,
        TaxCode: 12,
        PuchasePrice: formatNumber(item.PurchasePrice),
        Currency:"BRL",
        StandardPrice:"", 
        CommodityCode:"", 
        BaseSalesPrice:formatNumber(item.PriceList),
        CountryCurrency:"BRL",
        SSE:"NO",
        MaterialGroup:getSDMaterialGroup(item.Type),
        MRPindicator:"\"-\"",
        ROCP:"\"-\"",
        ReleasedCustomer:"\"-\"",
        SalesText: item.DescriptionBr.includes('-') ? item.DescriptionBr.split("-")[1]?.trim() || '' : item.DescriptionBr.trim(),
        BasicDataText:"\"-\"",
        Warranty:'60 months',
        DiscountGroup:''
      });

      if ((item.IsKit.toLowerCase() === 'y') && isKitComponents.length > 0) {
        isKitComponents.forEach((kitItem, indexKit) => {
          if (indexKit > 0) {
            sapList.push({
              SAPdata: index === 0 ? example : example + index, 
              RleaseGlobal: 'no',
              DescriptionEn: item.DescriptionEn, 
              DescriptionBr: item.DescriptionBr,
              SAPMaterial: item.Article, 
              OldERP: '',
              MaterialComponents: kitItem.trim(),
              QuantityComponents: 1, 
              Certificate: 'NO',
              Measure: 'PC',
              Weight: "\"-\"",
              Length: "\"-\"",
              Width: "\"-\"",
              Height: "\"-\"",
              IFMlabel: "YES - LABEL FROM SUPPLIER",
              CountryOrigin: 'BR',
              NCM: "\"-\"", 
              Supplier:"\"-\"",
              SAPsupplier:0, 
              DeliveryTime: 0, 
              TaxCode: 0, 
              PuchasePrice:"\"-\"",
              Currency:"BRL",
              StandardPrice:"",
              CommodityCode:"",
              BaseSalesPrice:"\"-\"",
              CountryCurrency:"BRL",
              SSE:"NO",
              MaterialGroup:null, 
              MRPindicator:"\"-\"",
              ROCP:"\"-\"",
              ReleasedCustomer:"\"-\"",
              SalesText:"\"-\"", 
              BasicDataText:"\"-\"",
              Warranty:'60 months',
              DiscountGroup:''
            })
          }
        })
      }
    });

    return sapList;
  }

  const verifyProductManagementType = (IsCalibrated: string, isKit: string) : string => {
    const calibratedBoolean = IsCalibrated.toLowerCase() === 'y';
    const kitBoolean = isKit.toLowerCase() === 'y';

    if (calibratedBoolean && !kitBoolean) {
      return 'Certificate'
    }
    if (!calibratedBoolean && kitBoolean) {
      return 'Only kit'
    }
    if (calibratedBoolean && kitBoolean) {
      return 'Kit with certificate'
    }
    return ''
  }

  const generateSharePointTemplate = (): sharePoint[] => {
    const sharePointList: sharePoint[] = [];

    zhh.forEach((item) => {
      sharePointList.push({
        ZHH:item.Article,
        ItemType:item.Type,
        ProductManagement:verifyProductManagementType(item.IsCalibrated, item.IsKit),
        Items:item.Items,
        Description: item.DescriptionBr.includes('-') ? item.DescriptionBr.split("-")[1]?.trim() || '' : item.DescriptionBr.trim(),
        Old:item.OldArticle
      })
    });

    return sharePointList;
  }

  const handleGenerateTemplates = (e:FormEvent) => {
    e.preventDefault();

    if (zhh[0].Article === "") { 
      toast.error('No ZHH data available to generate templates. Please paste data first.');
      return;
    }

    try {
      const generatedSap = generateSAPtemplate();
      const generatedSharePoint = generateSharePointTemplate();

      setSap(generatedSap);
      setSharePoint(generatedSharePoint);

      const availableTypes = [];
      if (generatedSap.length > 0) availableTypes.push('SAP template');
      if (generatedSharePoint.length > 0) availableTypes.push('ZHH SharePoint');

      setTypesList(availableTypes);
      if (availableTypes.length > 0) {
        setCurrentTypeList(availableTypes[0]);
      } else {
        setCurrentTypeList('');
      }

      toast.success('Templates generated successfully!');

    } catch (error) {
      console.error("Error generating templates:", error);
      toast.error("Error generating templates. Check console for details.");
    }
  }


  const resetApp = () =>{
    setSap(null);
    setSharePoint(null); 
    setZhh(initialZhhState); 
    setExample(0);
    setCurrentSupplier(suppliers[0]);
    setTypesList([]); 
    setCurrentTypeList('');
    toast.info('Application reset.');
  }

  function copyTableToClipboard<T extends object>(dataToCopy: T[] | null) {
    if (!dataToCopy || dataToCopy.length === 0) {
        toast.warn('Nothing to copy!');
        return;
    }

    const headers = Object.keys(dataToCopy[0]);
    const rowsAsStrings = dataToCopy.map(row => 
        headers.map(h => {
            const value = (row as any)[h];
            return value !== null && value !== undefined ? String(value) : '';
        })
    );

    const tableText = rowsAsStrings.map(row => row.join('\t')).join('\n');

    navigator.clipboard.writeText(tableText).then(() => {
      toast.success('Table copied to clipboard!');
    }).catch((err) => {
      console.error("Failed to copy to clipboard:", err);
      toast.error('Failed to copy to clipboard.');
    });
  }



  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>
      <main id='main'>

        <section id='titleSection'>
          <h1>Conversion from ZHH Plan to SAP Template</h1>

          {zhh[0].Article === "" && ( 
            <div id='tutorial'>
              <FaAngleDoubleDown/>
              <p>Paste the first row from your ZHH table</p>
            </div>
          )}
          
        </section>

        <section className='table-section'>
          <article className='brTableContainer scrollTable'>
            <table className='brTable'>
              <thead className='brThead'>
                <tr>
                  <th>Article</th><th>OldArticle</th><th>Type</th><th>IsCalibrated</th>
                  <th>DescriptionBr</th><th>DescriptionEn</th><th>Items</th><th>IsKit</th>
                  <th>Supplier</th><th>BasePriceFromItems</th><th>PurchasePrice</th>
                  <th>3rdServicePrice</th><th>PriceList</th><th>Volume</th><th>GrossWeight</th>
                  <th>NetWeight</th><th>Item 1</th><th>Price 1</th><th>PuchasePrice 1</th>
                  <th>Qty 1</th><th>Volume 1</th><th>GrossWeight 1</th><th>NetWeight 1</th>
                  <th>Device Length</th><th>Device Width</th><th>Device Height</th>
                </tr>
              </thead>
              <tbody className='brBody'>
                {zhh.map((item, index)=>{
                  return(
                    <tr key={index}>
                      {index === 0 ? ( 
                        <td contentEditable
                          suppressContentEditableWarning
                          onPaste={handlePaste}
                          autoFocus={true}
                          ref={tdRef}>
                            {item.Article}
                        </td>
                      ):(
                        <td>{item.Article}</td>
                      )}
                      <td>{item.OldArticle}</td>
                      <td>{item.Type}</td>
                      <td>{item.IsCalibrated}</td>
                      <td>{item.DescriptionBr}</td>
                      <td>{item.DescriptionEn}</td>
                      <td>{item.Items}</td>
                      <td>{item.IsKit}</td>
                      <td>{item.Supplier}</td>
                      <td>{item.BasePriceFromItems}</td>
                      <td>{item.PurchasePrice}</td>
                      <td>{item.RdServicePrice}</td>
                      <td>{item.PriceList}</td>
                      <td>{item.Volume}</td>
                      <td>{item.GrossWeight}</td>
                      <td>{item.NetWeight}</td>
                      <td>{item.Item1}</td>
                      <td>{item.Price1}</td>
                      <td>{item.PuchasePrice1}</td>
                      <td>{item.Qtd1}</td>
                      <td>{item.Volume1}</td>
                      <td>{item.GrossWeight1}</td>
                      <td>{item.NetWeight1}</td>
                      <td>{item.DeviceLength}</td>
                      <td>{item.DeviceWidth}</td>
                      <td>{item.DeviceHeight}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </article>
          
          {zhh[0].Article !== '' && ( 
            <form id='formInput' onSubmit={handleGenerateTemplates}>
              <article id='inputsArea'>
                <Input name='1° ZHH Example' value={example} onChange={e => setExample(Number(e.target.value))}/>
              </article>

              <div id='suppliersList'>
                <h3>Select Supplier:</h3>
                <div className="suppliers-buttons-wrapper">
                  {suppliers.map((item) => (
                    <button type='button'
                    onClick={()=>setCurrentSupplier(item)} 
                    key={item.vendor} 
                    className='supplier-button'>
                      <span style={{backgroundColor: item.vendor === currentSupplier.vendor ? 'var(--accent-color)' : ''}} />
                      <p>{item.Name}</p>
                    </button>
                  ))}
                </div>
              </div>
                
              <Button type='submit'>
                Generate Templates
              </Button>
            </form>
          )}
          
        </section>


        <section className="table-section result-section">
          {typesList.length > 0 && (
            <div className='typesListDiv'>
              {typesList.map((item) => (
                <button 
                  key={item} 
                  onClick={()=>setCurrentTypeList(item)}
                  className={`type-selector-button ${item === currentTypeList ? 'active' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {sap && sap.length > 0 && currentTypeList === 'SAP template' && (
            <article className="brTableContainer scrollTable">
              <table className="brTable">
                <thead className="brThead">
                  <tr>
                    {Object.keys(sap[0]).map(header => <th key={header}>{header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {sap.map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, i) => (
                        <td key={i}>
                          {value === null || value === undefined ? '' : String(value)} 
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          )}

          {sharePoint && sharePoint.length > 0 && currentTypeList === 'ZHH SharePoint' && (
            <article className="brTableContainer scrollTable">
              <table className="brTable">
                <thead className="brThead">
                  <tr>
                    {Object.keys(sharePoint[0]).map(header => <th key={header}>{header}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {sharePoint.map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, i) => (
                        <td key={i}>
                          {value === null || value === undefined ? '' : String(value)} 
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          )}

          {((sap && sap.length > 0) || (sharePoint && sharePoint.length > 0)) && (
            <div id="buttonsFinish">
              <button onClick={resetApp} 
              id='buttonClean' title="Clear all data">
                <MdOutlineCleaningServices />
              </button>

              {currentTypeList === 'SAP template' && sap && sap.length > 0 && (
                <button onClick={() => copyTableToClipboard(sap)} 
                id='buttonCopy' title="Copy SAP Template to clipboard">
                  <MdContentCopy />
                </button>
              )}
              {currentTypeList === 'ZHH SharePoint' && sharePoint && sharePoint.length > 0 && (
                <button onClick={() => copyTableToClipboard(sharePoint)} 
                id='buttonCopy' title="Copy ZHH SharePoint data to clipboard">
                  <MdContentCopy />
                </button>
              )}
            </div>
          )}

        </section>
          
      </main>
    </>
  )
}

export default App