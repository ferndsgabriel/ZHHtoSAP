import { useEffect, useRef, useState, type FormEvent } from 'react';
import './App.css'
import Input from './components/ui/Input';
import Button from './components/ui/Button';
import { MdContentCopy,  MdOutlineCleaningServices } from "react-icons/md";
import { FaAngleDoubleDown } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';


interface brZhh {
  "Article": any;
  "OldArticle": any;
  "Type": any;
  "IsCalibrated": any;
  "DescriptionBr": any;
  "DescriptionEn": any;
  "Items":any;
  "NCM": any;
  "IsKit": any;
  "Supplier": any;
  "BasePriceFromItems": any;
  "PurchasePrice": any;
  "RdServicePrice": any;
  "PriceList": any;
  "Volume": any;
  "GrossWeight":any;
  "NetWeight":any;
  "Item1": any;
  "Price1": any;
  "PuchasePrice1": any;
  "Qtd1": any;
  "Volume1": any;
  "GrossWeight1": any;
  "NetWeight1": any;
}

interface sapTemplate{
  SAPdata:any;
  RleaseGlobal:any;
  DescriptionEn:any;
  DescriptionBr:any;
  SAPMaterial:any;
  OldERP:any;
  MaterialComponents:any;
  QuantityComponents:any;
  Certificate:any;
  Measure:any;
  Weight:any;
  Length:any;
  Width:any;
  Height:any;
  IFMlabel:any;
  CountryOrigin:any;
  NCM:any;
  Supplier:any;
  SAPsupplier:any;
  DeliveryTime:any;
  TaxCode:any;
  PuchasePrice:any;
  Currency:any;
  StandardPrice:any;
  CommodityCode:any;
  BaseSalesPrice:any;
  CountryCurrency:any;
  SSE:any;
  MaterialGroup:any;
  MRPindicator:any;
  ROCP:any;
  ReleasedCustomer:any;
  SalesText:any;
  BasicDataText:any;
  Warranty:any;
  DiscountGroup:any
}

interface suppliersProps{
  Name:string;
  vendor:number
}

function App() {
  const [zhh, setZhh] = useState<brZhh>({
    Article:'',
    OldArticle:'',
    Type:'',
    IsCalibrated:'',
    DescriptionBr:'',
    DescriptionEn:'',
    Items:'',
    NCM:'',
    IsKit:'',
    Supplier:'',
    BasePriceFromItems:'',
    PurchasePrice:'',
    RdServicePrice:'',
    PriceList:'',
    Volume:'',
    GrossWeight:'',
    NetWeight:'',
    Item1:'' ,
    Price1:'',
    PuchasePrice1:'',
    Qtd1:'',
    Volume1:'',
    GrossWeight1:'',
    NetWeight1:''
  });

  const [sap, setSap] = useState<sapTemplate[] | null> (null);
  
  const [example, setExample] = useState(0);
  const [itemQty, setItemQty] = useState(1);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const tdRef = useRef<HTMLTableCellElement>(null);
  
  useEffect(() => {
    tdRef.current?.focus();
  }, []);

  const suppliers: suppliersProps[] = [
    {
      Name:'BEVER',
      vendor:1039963
    },
    {
      Name:'Vibmaster',
      vendor:5435164
    },
    {
      Name:'Andreassa',
      vendor:1034087
    },
    {
      Name:'AT4',
      vendor:1042635
    },
    {
      Name:'Imediato',
      vendor:1041806
    },
    {
      Name:'LGM',
      vendor:1035303
    },
    {
      Name:'MATH TECNOLOGIA',
      vendor:1035364
    }
  ];

  const [currentSupplier, setCurrentSupplier] = useState<suppliersProps>(suppliers[0]);


  const handlePaste = (e: React.ClipboardEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text"); 
    const lines = text.split("\n").map(l => l.split("\t"))[0];
    
    setZhh({
      Article:lines[0] || '',
      OldArticle:lines[1] || '',
      Type:lines[2] || '',
      IsCalibrated:lines[3] || '',
      DescriptionBr:lines[4] || '',
      DescriptionEn:lines[5] || '',
      Items:lines[6] || '',
      NCM:lines[7] || '',
      IsKit:lines[8] || '',
      Supplier:lines[9] || '',
      BasePriceFromItems:lines[10] || '',
      PurchasePrice:lines[11] || '',
      RdServicePrice:lines[12] || '',
      PriceList:lines[13] || '',
      Volume:lines[14] || '',
      GrossWeight:lines[15] || '',
      NetWeight:lines[16] || '',
      Item1:lines[17] || '',
      Price1:lines[18] || '',
      PuchasePrice1:lines[19] || '',
      Qtd1:lines[20] || '',
      Volume1:lines[21] || '',
      GrossWeight1:lines[22] || '',
      NetWeight1:lines[23] || ''

    });
  };

  function formatNumber(str: string) {
    return str
      .replace(/[^0-9.,]/g, '')  
      .replace(',', '.');        
  }

  const getSDMaterialGroup = (type:string) => {
    if (!type) return;

    const formatType = type.trim();

    const find: Record<string, number> = {
      "Acessório":110010,
      "Vibração":210010,
      "Umidade":205050,
      "Ultrassônico":106010,
      "Temperatura":203010,
      "Temperatura TW":203010,
      "TAG":502010,
      "RFID":502010,
      "Pressão":202010,
      "Partículas":200010,
      "Nível LM/LI":310010,
      "Nível LW/R/K/T":310010,
      "Módulo":102010,
      "Magnético":102010,
      "Indutivo":100010,
      "Inclinação":600010,
      "Fotoelétrico":104010,
      "Fluxo":201010,
      "Fluxo SM/U":201010,
      "Encoder":105010,
      "Distância":104040,
      "Controle":300010,
      "Condutividade":205010,
      "Capacitivo":103010,
      "Cabos/Conectores":330010,
      "Safety":320010,
      "As-i Interface ":320000
    }

    if (find[formatType]) {
      return find[formatType];
    }else{
      toast.warning('SD Material Group not found');
      return null;
    }
  }

  const generateSAPtemplate = (e:FormEvent) => {
    
    e.preventDefault();

    if (zhh.Items == ""){
      return;
    }

    const itens = zhh.Items.split("-");

    const mtdList = [] as sapTemplate[];

  
    if (itens.length > 0) {
      itens.forEach((item:string, index:number) => {

        if (index === 0) {
          const mtd: sapTemplate = {
            SAPdata: example,
            RleaseGlobal: 'no',
            DescriptionEn: zhh.DescriptionEn,
            DescriptionBr: zhh.DescriptionBr,
            SAPMaterial: zhh.Article,
            OldERP: '',
            MaterialComponents: item,
            QuantityComponents: itemQty > 0 ? itemQty : 1,
            Certificate: zhh.IsCalibrated === 'y' || zhh.IsCalibrated === 'Y' ? 'YES' : 'NO',
            Measure: 'PC',
            Weight: zhh.NetWeight1,
            Length: length < 1 ? "\"-\"" : length,
            Width: width < 1 ? "\"-\"" : width,
            Height: height < 1 ? "\"-\"" : height,
            IFMlabel: "YES - LABEL FROM SUPPLIER",
            CountryOrigin: 'BR',
            NCM: zhh.NCM,
            Supplier:currentSupplier.Name,
            SAPsupplier:currentSupplier.vendor,
            DeliveryTime:zhh.IsCalibrated? 15 : 5,
            TaxCode:12,
            PuchasePrice:formatNumber(zhh.PurchasePrice),
            Currency:"BRL",
            StandardPrice:"",
            CommodityCode:"",
            BaseSalesPrice:formatNumber(zhh.PriceList),
            CountryCurrency:"BRL",
            SSE:"NO",
            MaterialGroup:getSDMaterialGroup(zhh.Type),
            MRPindicator:"\"-\"",
            ROCP:"\"-\"",
            ReleasedCustomer:"\"-\"",
            SalesText:zhh.DescriptionBr.split("-")[1],
            BasicDataText:"\"-\"",
            Warranty:'60 months',
            DiscountGroup:''
          };
          mtdList.push(mtd);
        } else {
          const mtd: sapTemplate = {
            SAPdata: example,
            RleaseGlobal: 'no',
            DescriptionEn: zhh.DescriptionEn,
            DescriptionBr: zhh.DescriptionBr,
            SAPMaterial: zhh.Article,
            OldERP: '',
            MaterialComponents: item,
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
            SAPsupplier:"\"-\"",
            DeliveryTime:zhh.IsCalibrated? 15 : 5,
            TaxCode:12,
            PuchasePrice:"\"-\"",
            Currency:"BRL",
            StandardPrice:"",
            CommodityCode:"",
            BaseSalesPrice:"\"-\"",
            CountryCurrency:"BRL",
            SSE:"NO",
            MaterialGroup:"\"-\"",
            MRPindicator:"\"-\"",
            ROCP:"\"-\"",
            ReleasedCustomer:"\"-\"",
            SalesText:"\"-\"",
            BasicDataText:"\"-\"",
            Warranty:'60 months',
            DiscountGroup:''
          };
          mtdList.push(mtd);
        }

      });
    }

    setSap(mtdList);

  }

  const resetApp = () =>{
    setSap(null);
    setZhh({ 
      Article:'',
      OldArticle:'',
      Type:'',
      IsCalibrated:'',
      DescriptionBr:'',
      DescriptionEn:'',
      Items:'',
      NCM:'',
      IsKit:'',
      Supplier:'',
      BasePriceFromItems:'',
      PurchasePrice:'',
      RdServicePrice:'',
      PriceList:'',
      Volume:'',
      GrossWeight:'',
      NetWeight:'',
      Item1:'' ,
      Price1:'',
      PuchasePrice1:'',
      Qtd1:'',
      Volume1:'',
      GrossWeight1:'',
      NetWeight1:''
    });
    setExample(0);
    setLength(0);
    setWidth(0);
    setHeight(0);
    setCurrentSupplier(suppliers[0])
  }

  function copyTableToClipboard(sap: sapTemplate[] | null) {
    if (!sap) return;

    const headers = Object.keys(sap[0]);
    const tableText = sap
      .map(row => headers.map(h => (row as any)[h] ?? "").join('\t'))
      .join('\n');

    navigator.clipboard.writeText(tableText).then(() => {
      toast.success('Copy to clipboard');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  }


  return (
    <>
      <ToastContainer />
      <main id='main'>

        <section id='titleSection'>
          <h1>Conversion from ZHH Plan to SAP Template</h1>

          {zhh.DescriptionBr == "" && (
            <div id='tutorial'>
              <FaAngleDoubleDown/>
              <p>Paste the row from your table</p>
            </div>
          )}
          
        </section>

        <section className='table-section'>

          <article className='brTableContainer scrollTable'>
            <table className='brTable'>
              <thead className='brThead'>
                <tr>
                  <th>Article</th>
                  <th>OldArticle</th>
                  <th>Type</th>
                  <th>IsCalibrated</th>
                  <th>DescriptionBr</th>
                  <th>DescriptionEn</th>
                  <th>Items</th>
                  <th>IsKit</th>
                  <th>Supplier</th>
                  <th>BasePriceFromItems</th>
                  <th>PurchasePrice</th>
                  <th>3rdServicePrice</th>
                  <th>PriceList</th>
                  <th>Volume</th>
                  <th>GrossWeight</th>
                  <th>NetWeight</th>
                  <th>Item 1</th>
                  <th>Price 1</th>
                  <th>PuchasePrice 1</th>
                  <th>Qty 1</th>
                  <th>Volume 1</th>
                  <th>GrossWeight 1</th>
                  <th>NetWeight 1</th>
                </tr>
              </thead>
              <tbody>
                {zhh && 
                  <tr>

                    <td contentEditable
                      suppressContentEditableWarning
                      onPaste={handlePaste}
                      autoFocus={true}
                      ref={tdRef}>
                        {zhh.Article}
                    </td>

                    <td>{zhh.OldArticle}</td>
                    <td>{zhh.Type}</td>
                    <td>{zhh.IsCalibrated}</td>
                    <td>{zhh.DescriptionBr}</td>
                    <td>{zhh.DescriptionEn}</td>
                    <td>{zhh.Items}</td>
                    <td>{zhh.IsKit}</td>
                    <td>{zhh.Supplier}</td>
                    <td>{zhh.BasePriceFromItems}</td>
                    <td>{zhh.PurchasePrice}</td>
                    <td>{zhh.RdServicePrice}</td>
                    <td>{zhh.PriceList}</td>
                    <td>{zhh.Volume}</td>
                    <td>{zhh.GrossWeight}</td>
                    <td>{zhh.NetWeight}</td>
                    <td>{zhh.Item1}</td>
                    <td>{zhh.Price1}</td>
                    <td>{zhh.PuchasePrice1}</td>
                    <td>{zhh.Qtd1}</td>
                    <td>{zhh.Volume1}</td>
                    <td>{zhh.GrossWeight1}</td>
                    <td>{zhh.NetWeight1}</td>
                  </tr>
                }
              </tbody>
            </table>
          </article>
          
          {zhh && zhh.Items !== '' && (
            <form id='formInput' onSubmit={generateSAPtemplate}>
              <article id='inputsArea'>
                <Input name='ZHH Example' value={example} onChange={e => setExample(Number(e.target.value))}/>
                <Input name='Device Qty' value={itemQty} onChange={e => setItemQty(Number(e.target.value))}/>
                <Input name='Device Length' value={length} onChange={e => setLength(Number(e.target.value))}/>
                <Input name='Device Width' value={width} onChange={e => setWidth(Number(e.target.value))}/>
                <Input name='Device Height' value={height} onChange={e => setHeight(Number(e.target.value))}/>
              </article>

              <div id='suppliersList'>
                {suppliers && suppliers.length > 0 && (
                  suppliers.map((item, index)=>{
                    return(
                      <button type='button'
                      onClick={()=>setCurrentSupplier(suppliers[index])} 
                      key={index} id='supplierButton'>
                        <span style={{backgroundColor: item.vendor === currentSupplier.vendor ? 'rgb(101, 155, 226)' : ''}} />
                        <p>{item.Name}</p>
                      </button>
                    )
                  })
                )}
              </div>
                
              <Button type='submit'>
                Generate SAP template
              </Button>
            </form>
          )}
          
        </section>


        <section className="table-section">
          {sap && sap.length > 0 && (
            <article className="brTableContainer scrollTable">
              <table className="brTable">
                <thead className="brThead">
                  <tr>
                    <th>SAPdata</th>
                    <th>RleaseGlobal</th>
                    <th>DescriptionEn</th>
                    <th>DescriptionPt</th>
                    <th>SAPMaterial</th>
                    <th>OldERP</th>
                    <th>MaterialComponents</th>
                    <th>QuantityComponents</th>
                    <th>Certificate</th>
                    <th>Measure</th>
                    <th>Weight</th>
                    <th>Length</th>
                    <th>Width</th>
                    <th>Height</th>
                    <th>IFMlabel</th>
                    <th>CountryOrigin</th>
                    <th>NCM</th>
                    <th>Supplier</th>
                    <th>SAPsupplier</th>
                    <th>DeliveryTime</th>
                    <th>TaxCode</th>
                    <th>PuchasePrice</th>
                    <th>Currency</th>
                    <th>StandardPrice</th>
                    <th>CommodityCode</th>
                    <th>BaseSalesPrice</th>
                    <th>CountryCurrency</th>
                    <th>SSE</th>
                    <th>MaterialGroup</th>
                    <th>MRPindicator</th>
                    <th>ROCP</th>
                    <th>ReleasedCustomer</th>
                    <th>SalesText</th>
                    <th>BasicDataText</th>
                    <th>Warranty</th>
                    <th>DiscountGroup</th>
                  </tr>
                </thead>
                <tbody>
                  {sap.map((item, index) => (
                    <tr key={index}>
                      <td>{item.SAPdata}</td>
                      <td>{item.RleaseGlobal}</td>
                      <td>{item.DescriptionEn}</td>
                      <td>{item.DescriptionBr}</td>
                      <td>{item.SAPMaterial}</td>
                      <td>{item.OldERP}</td>
                      <td>{item.MaterialComponents}</td>
                      <td>{item.QuantityComponents}</td>
                      <td>{item.Certificate}</td>
                      <td>{item.Measure}</td>
                      <td>{item.Weight}</td>
                      <td>{item.Length}</td>
                      <td>{item.Width}</td>
                      <td>{item.Height}</td>
                      <td>{item.IFMlabel}</td>
                      <td>{item.CountryOrigin}</td>
                      <td>{item.NCM}</td>
                      <td>{item.Supplier}</td>
                      <td>{item.SAPsupplier}</td>
                      <td>{item.DeliveryTime}</td>
                      <td>{item.TaxCode}</td>
                      <td>{item.PuchasePrice}</td>
                      <td>{item.Currency}</td>
                      <td>{item.StandardPrice}</td>
                      <td>{item.CommodityCode}</td>
                      <td>{item.BaseSalesPrice}</td>
                      <td>{item.CountryCurrency}</td>
                      <td>{item.SSE}</td>
                      <td>{item.MaterialGroup}</td>
                      <td>{item.MRPindicator}</td>
                      <td>{item.ROCP}</td>
                      <td>{item.ReleasedCustomer}</td>
                      <td>{item.SalesText}</td>
                      <td>{item.BasicDataText}</td>
                      <td>{item.Warranty}</td>
                      <td>{item.DiscountGroup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          )}

          {sap && sap.length > 0 && (
            <div id="buttonsFinish">

              <button onClick={resetApp} 
              id='buttonClean'>
                <MdOutlineCleaningServices />
              </button>

              <button onClick={()=>copyTableToClipboard(sap)} 
              id='buttonCopy'>
                <MdContentCopy />
              </button>
            </div>
          )}

        </section>
          
      </main>
    </>
  )
}

export default App
