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
        // GET: /Procurement/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CallQuotations()
        {
            return View();
        }

        public JsonResult GetAllItems()
        {
            /*Dolomite,Silica, etc*/
            return Json(new { /*itemId, ItemName*/});
        }

        public JsonResult GetAllSuppliers()
        {
            return Json(new { /*IList<supplier>*/});
        }

        public JsonResult AddQuotation(/*quotation*/)
        {
            /*
             * id int,
             * title string,
             * duedate datetime,
             * description string,
             * attachment string (path)
             * IList<int> supplierIds ==> this should hold in a middle table where quotations and supplier can be mapped (1 to many)
             * Ilist<QuotationItem> ItemsToBequoted ==>(itemId int, QtyToQuote float) this also a middle table (1 to many),
             * status <datatype> => initially this can be pending and will be updated on reciept of quotations by suppliers
             * 
             */

            return Json(new { /*isSuccess*/});
        }

        public ActionResult ReceivedQuotationList()
        {
            return View();
        }

        public JsonResult GetAllQuotationsRecievedBySuppliers()
        {
            /*
             * basic details of quotations
             */
            return Json(new {/*IList<quotation>*/ });
        }

        public JsonResult GetQuotationDetailsById(int quotationId)
        {
            /*initially required here is the summary of quotes recived by different suppliers for selected quotation request
             * sample dataset=>
             *   ['supplierId':1,'supplier': "Sunil Traders",'totalBid': 125,'supplierRating': "4"]
             *   ['supplierId':2,'supplier': "ABC (pvt) Ltd",'totalBid': 130,'supplierRating': "5"]
             */
            return Json(new { });
        }

        public JsonResult GetQuotationRecievedByTheSupplier(int quotationId, int supplierId)
        {
            /*
             * sample dataset=>
             *  'supplierId': 1,
                'supplier': 'Sunil Traders',
             *  'Supplier Address':'xxxx'
             *  'Contact Number':'xxx'
             *  'Description':'xx'
                'items': [
               { 'id': 1, 'item': 'Dolomite', 'price': 40 },
                { 'id': 2, 'item': 'Silica', 'price': 25 },
                { 'id': 3, 'item': 'Soda ash', 'price': 15 },
                { 'id': 4, 'item': 'Felspar', 'price': 20 },
                { 'id': 5, 'item': 'Cullets', 'price': 25 }
            ]
             */
            return Json(new { });
        }

        public JsonResult GetQuotationsForItemsByEachSupplier(int quotationId)
        {
            /*
             * IList  sample dataset (following is 1 object in the list)=>
             *  'supplierId': 1,
                'supplier': 'Sunil Traders',
                'items': [
                { 'id': 1, 'item': 'Dolomite', 'price': 40 },
                { 'id': 2, 'item': 'Silica', 'price': 25 },
                { 'id': 3, 'item': 'Soda ash', 'price': 15 },
                { 'id': 4, 'item': 'Felspar', 'price': 20 },
                { 'id': 5, 'item': 'Cullets', 'price': 25 }
             * 
             */
            return Json(new {/*IList<quotationBysupplier>*/ });
        }

        public ActionResult PR()
        {
            return View();
        }

        public JsonResult GetAllPRs()
        {
            /*
             * id int,
             * dateOfPr datetime,
             * status <datatype> ==> pending or recieved ...
             * IsAddedToInventory bool
             */
            return Json(new { /*IList<PR>*/});
        }

        public JsonResult GetPrDetailsById(int prId)
        {
            /*this requires the item details in selected PR
             sample data would be,
             *  [{ 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'qty': 153575, 'avgLeadTime': 20 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'qty': 47835, 'avgLeadTime': 18 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'qty': 64150, 'avgLeadTime': 26 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'qty': 79250, 'avgLeadTime': 12 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'qty': 149900, 'avgLeadTime': 10 }]
             */

            return Json(new { /*Pr item details*/});
        }

        public JsonResult GetSummaryOfAllPendingPR()
        {
            /*this requires the item summary of all PRs which are on pending status, sample dataset would be,
              [{ 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'TotalPRqty': 215995, 'avgLeadTime': 20 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'TotalPRqty': 105071, 'avgLeadTime': 18 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'TotalPRqty': 119300, 'avgLeadTime': 26 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'TotalPRqty': 151700, 'avgLeadTime': 12 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'TotalPRqty': 282530, 'avgLeadTime': 10 }]
             */
            return Json(new { });
        }

        public JsonResult GetSummaryOfSelectedPRs(IList<int> selectedPrIds)
        {
            /*this requires the item summary of selected PRs , sample dataset would be,
                       [{ 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'TotalPRqty': 215995, 'avgLeadTime': 20 },
                       { 'id': 2, 'item': 'silica', 'UOM': 'g', 'TotalPRqty': 105071, 'avgLeadTime': 18 },
                       { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'TotalPRqty': 119300, 'avgLeadTime': 26 },
                       { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'TotalPRqty': 151700, 'avgLeadTime': 12 },
                       { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'TotalPRqty': 282530, 'avgLeadTime': 10 }]
                        */
            return Json(new { });
        }

        public JsonResult GetSupplyHistoryOfItem(int itemId)
        {
            /* as an example if we consider history for dolamite, sample data set would be,
             *  { 'id': 1, 'Supplier': 'Supplier 1', 'AvgLeadTime': 19 },
                { 'id': 2, 'Supplier': 'Supplier 2', 'AvgLeadTime': 22 },
                { 'id': 3, 'Supplier': 'Supplier 3', 'AvgLeadTime': 20 },
                { 'id': 4, 'Supplier': 'Supplier 4', 'AvgLeadTime': 17 },
                { 'id': 5, 'Supplier': 'Supplier 5', 'AvgLeadTime': 21 }
             */

            return Json(new { });
        }

        public JsonResult GetSupplyHistoryByEachSupplierForSelectedItems(IList<int> itemId)
        {
            /* NOTE:: pass 'null' if supplier is not consist any data for selected item list otherwise 
             * chart wont get populated correctly
             */

            /*
             * the items listed on PR summary we have to get the supply history of different suppliers
             * sample data set would be,
             * supplier 1 :
             * ['ItemId': 1,'Item': 'dolamite','AvgLeadTime':19']
             * ['ItemId': 2,'Item': 'silica','AvgLeadTime':20']
             * ['ItemId': 3,'Item': 'soda ash','AvgLeadTime':25']
             * ['ItemId': 4,'Item': 'felspar','AvgLeadTime':18']
             * ['ItemId': 5,'Item': 'cullets','AvgLeadTime':15']
             * 
             * supplier 2 :
             * ['ItemId': 1,'Item': 'dolamite','AvgLeadTime':17']
             * ['ItemId': 2,'Item': 'silica','AvgLeadTime':20']
             * ['ItemId': 3,'Item': 'soda ash','AvgLeadTime':22']
             * ['ItemId': 4,'Item': 'felspar','AvgLeadTime':21']
             * ['ItemId': 5,'Item': 'cullets','AvgLeadTime':16']
             */

            return Json(new { });
        }

        /****** new methods *******/

        public JsonResult GetSupplyHistoryByEachSupplierForSelectedItemsWithinAvgLeadTimeRange(IList<int> itemId, int startingLeadTime, int endingLeadTime)
        {
            /*this list should in same order as list in GetSupplyHistoryByEachSupplierForSelectedItems(IList<int> itemId) may be order by supplier name 
             * NOTE:: pass 'null' if supplier is not consist any data for selected item list otherwise chart wont get populated correctly*/

            /*
             * the items listed on PR summary we have to get the supply history of different suppliers
             * sample data set would be,
             * supplier 1 :
             * ['ItemId': 1,'Item': 'dolamite','AvgLeadTime':19']
             * ['ItemId': 2,'Item': 'silica','AvgLeadTime':20']
             * ['ItemId': 3,'Item': 'soda ash','AvgLeadTime':25']
             * ['ItemId': 4,'Item': 'felspar','AvgLeadTime':18']
             * ['ItemId': 5,'Item': 'cullets','AvgLeadTime':15']
             * 
             * supplier 2 :
             * ['ItemId': 1,'Item': 'dolamite','AvgLeadTime':17']
             * ['ItemId': 2,'Item': 'silica','AvgLeadTime':20']
             * ['ItemId': 3,'Item': 'soda ash','AvgLeadTime':22']
             * ['ItemId': 4,'Item': 'felspar','AvgLeadTime':21']
             * ['ItemId': 5,'Item': 'cullets','AvgLeadTime':16']
             */

            return Json(new { });
        }

        public JsonResult GetPendingPRs()
        {
            /*
             * id int,
             * dateOfPr datetime,
             * status <datatype> ==> pending or recieved ...
             * IsAddedToInventory bool
             */
            return Json(new { /*IList<PR>*/});
        }

        public JsonResult UpdatePRstatusToQuotationCalled(IList<int> prIds)
        {
            /*NOTE:: if there is only one item in the list and if it is -1 , then update the 
             * status of all the PR items with pending status  */

            return Json(new { /*isSuccess*/});
        }


        public JsonResult UpdatePRItemsStatus(IList<int> prId, string status)
        {
            /*
             * send notification to store manager if the status is updated to 'R' --> recieved, so that he can supply items
             * to production department
             * ChangeStatus();
             * 
             * if(status=="R"){
             *  AddNotification(storeManager)
             * }
             */

            return Json(new { /*isSuccess*/});
        }
        
    }
}
