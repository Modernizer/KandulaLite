using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ceyglass.application.Controllers
{
    public class PurchasingController : Controller
    {
        //
        // GET: /Purchasing/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CallQuotations()
        {
            return View();
        }


        public ActionResult ReceivedQuotationList()
        {
            return View();
        }

        public ActionResult PR()
        {
            return View();
        }

        public ActionResult PO()
        {
            return View();
        }

        public ActionResult DO()
        {
            return View();
        }

        /*quotation actions*/

        public JsonResult GetAllInventoryItems_RawMaterials()
        {
            return Json(new {/*items=.. (IList<InventoryItem>).where(Category is Raw Materials) */});
        }

        public JsonResult GetAllSuppliers()
        {
            return Json(new { /*suppliers=.. IList<Supplier>*/});
        }

        public JsonResult AddQuotation(/*Quotation quotation*/)
        {

            return Json(new { /*isSuccess= .. (bool)*/});
        }


        /*end of quotation actions*/

        /*PR related actions*/

        public JsonResult GetPendingPRListToPurchase()
        {
            return Json(new { /*pendingPrs= .. (IList<PurchaseRequsition>).where(status is pending)*/});
        }

        public JsonResult GetPrDetailsById(int prId)
        {
            /*
             * this requires a view model of PurchaseRequsitionItem table containing,
             * ItemId,Name,UOM,Qty,AverageLeadTime
             * 
             * you may use 'PurchaseRequsitionItem' table & 'InventoryItem' table to get requested details
             */

            return Json(new { /*items= .. IList<PurchaseRequsitionItem_viewmodel>*/});
        }

        public JsonResult GetAllPendingPRDetailsSummary()
        {
            /*return IList<PurchaseRequsitionItem_viewmodel> containing the summary of all pending PR lists recieved */
            return Json(new { /*items= .. IList<PurchaseRequsitionItem_viewmodel>*/});
        }

        public JsonResult GetPRDetailsSummaryOfSelectedPendingPRs(/*IList<PurchaseRequsition> pr*/)
        {
            /*return IList<PurchaseRequsitionItem_viewmodel> containing the summary of above selected pending PR lists 
             * NOTE: above IList objects only containing the 'Id' property of 'PurchaseRequsition' so based on that Id
             * return the summary of 'PurchaseRequsitionItem' list
             */
            return Json(new { /*items= .. IList<PurchaseRequsitionItem_viewmodel>*/});
        }


        public JsonResult UpdatePRStatusToQuotationsCalled(/*IList<PurchaseRequsition> pr*/)
        {
            /*NOTE:: above IList only contain the Id property of PurchaseRequsition so take that Id to update
             * the status of PR to 'QuotationCalled'*/

            return Json(new { /*isSuccess=.. (bool)*/});
        }

        /*end of PR related actions*/

        /*PO related actions*/

        public JsonResult AddPO(/*PurchaseOrder po*/)
        {
            return Json(new { /*isSuccess=.. (bool)*/});
        }

        public JsonResult GetAllPOs()
        {
            /*
             * this action should return a view model of PurchaseOrder object continging,
             * Id,
             * SupplierId,
             * SupplierName, // this should get from the supplier table
             * PODate,
             * TotalCost,
             * ExpectedDeliveryDate,
             * CurrencyCode,
             * Status
             */

            return Json(new { /*pos= .. IList<PurchaseOrder_Viewmodel>*/});
        }

        public JsonResult GetPODetailsById(int poId)
        {
            /*
             * this required a view model of PurchaseOrderItem  containing
             * ItemId,
             * ItemName,
             * Qty,
             * UnitPrice,
             * UOM
             */

            return Json(new {/*items= .. IList<PurchaseOrderItem_ViewModel>*/ });
        }

        /*end of PO related actions*/

        /*DO related actions*/

        /*this will used to map PO to the selected DO*/
        public JsonResult GetPendingPOs()
        {
            /*here the purchase order Id is enough but its ok to send the whole object im anyway taking the Id filed
             * from the javascript
             */

            return Json(new {/*pos= .. (IList<PurchaseOrder>).Where(Status is pending)*/ });
        }

        public JsonResult AddDO(/*DeliveryOrder _do*/)
        {
            /*
             * NOTE: as soon as you added OD, change the related PO status to 'Dilivered'
             * and generate GRN to be viewed by store manager
             * mean time add notification to store manager
             */

            return Json(new { /*isSuccess=.. (bool)*/});
        }

        public JsonResult GetAllDOs()
        {
            /*
             * this should return a view model of DeliveryOrder object list containing,
             * Id,
             * SupplierId,
             * SupplierName,
             * DeliverdOn,
             * POId
             */

            return Json(new { /*dos= .. IList<DeliveryOrder_Viewmodel>*/});
        }

        public JsonResult GetPOById(int poId)
        {
            /*
             * this method required matcing PO object's view model including some additional properties
             * following is a sample object i used in javascript
             *
               {
                'PODate': '09/18/2013',
                'TotalCost': 1250430,
                'ExpectedDeliveryDate': '10/15/2013',
                'CurrencyCode': 'LKR',
                'Status': 'Pending',
                'OrderedItems': [
                                { 'ItemId': 1, 'ItemName': 'Dolomite', 'Qty': 1000, 'UnitPrice': 20, 'UOM': 'g' },
                                { 'ItemId': 2, 'ItemName': 'Silica', 'Qty': 1200, 'UnitPrice': 19, 'UOM': 'g' },
                                { 'ItemId': 3, 'ItemName': 'Soda ash', 'Qty': 800, 'UnitPrice': 25, 'UOM': 'g' },
                                { 'ItemId': 4, 'ItemName': 'Felspar', 'Qty': 600, 'UnitPrice': 28, 'UOM': 'g' },
                                { 'ItemId': 5, 'ItemName': 'Cullets', 'Qty': 900, 'UnitPrice': 18, 'UOM': 'g' }]
                }
             */

            return Json(new { /*po= .. PurchaseOrder_ViewModel*/});
        }


        /*end of DO related actions*/
    }
}
