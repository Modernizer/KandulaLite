using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ceyglass.application.Controllers
{
    public class StoreController : Controller
    {
        //
        // GET: /Store/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PurchasingList()
        {
            return View();
        }

        public JsonResult GetAllInventoryOrders()
        {
            /*
             * id int,
             * productionStartDate datetime,
             * specialNotes string?,
             * Status <datatype> ==> may be we can use 'P' for pending or something like that
             */
            return Json(new {/*IList<InventoryOrder>*/ });
        }

        public JsonResult GetInventoryOrderDetails(int orderId)
        {
            /*this requires a view model, following type of object list is required
             [ { 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'requestedQty': 153575, 'avgLeadTime': 20, 'minOrderLevel': 50000, 'available': 150000 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'requestedQty': 47835, 'avgLeadTime': 18, 'minOrderLevel': 140000, 'available': 132800 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'requestedQty': 64150, 'avgLeadTime': 26, 'minOrderLevel': 50000, 'available': 180000 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'requestedQty': 79250, 'avgLeadTime': 12, 'minOrderLevel': 50000, 'available': 120000 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'requestedQty': 149900, 'avgLeadTime': 10, 'minOrderLevel': 50000, 'available': 168900 }]
             */
            return Json(new {/*view model*/ });
        }

        public JsonResult GetInventoryOrderDetailsIncludingAllPendingInventoryRequests(int orderId)
        {
            /*this requires a view model, following type of object list is required
                       [ { 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'requestedQty': 153575, allPendingInventoryReqs: XXX, 'avgLeadTime': 20, 'minOrderLevel': 50000, 'available': 150000 },
                      { 'id': 2, 'item': 'silica', 'UOM': 'g', 'requestedQty': 47835, allPendingInventoryReqs: XXX, 'avgLeadTime': 18, 'minOrderLevel': 140000, 'available': 132800 },
                      { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'requestedQty': 64150, allPendingInventoryReqs: XXX, 'avgLeadTime': 26, 'minOrderLevel': 50000, 'available': 180000 },
                      { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'requestedQty': 79250, allPendingInventoryReqs: XXX, 'avgLeadTime': 12, 'minOrderLevel': 50000, 'available': 120000 },
                      { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'requestedQty': 149900, allPendingInventoryReqs: XXX, 'avgLeadTime': 10, 'minOrderLevel': 50000, 'available': 168900 }]
                       */
            return Json(new { /*view model*/});
        }

        public JsonResult AddToTempPRList(/*IList<TempPRItem>*/)
        {
            /*TempPRItem contain only itemId and the qty of that item to be purchase, this table will be cleared as soon as
             total PR is confirmed and send to the purchasing department*/
            /*TempPRItem(){itemId=xx,qty=XX}*/
            return Json(new { /*isSuccess*/});
        }

        public JsonResult GetTotalTempPRDetails()
        {
            /*this requires a view model which includes total of tempPRs matching to each item alone with its general details*/

            /*sample dataset =>
             [
            { 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'totalTempPRvalues': 85000, 'avgLeadTime': 20, 'minOrderLevel': 50000, 'available': 150000 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'totalTempPRvalues': 100000, 'avgLeadTime': 18, 'minOrderLevel': 140000, 'available': 132800 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'totalTempPRvalues': 75000, 'avgLeadTime': 26, 'minOrderLevel': 50000, 'available': 180000 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'totalTempPRvalues': 120000, 'avgLeadTime': 12, 'minOrderLevel': 50000, 'available': 120000 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'totalTempPRvalues': 90000, 'avgLeadTime': 10, 'minOrderLevel': 50000, 'available': 168900 }]*/
            return Json(new {/*view model*/ });
        }

        public JsonResult AddPR(/*PR object*/)
        {
            /*ActualPRItem is differs from TempPRItem since as soon as this PR get saved we have to clear the temp PR table*/
            /*Id int,
             * dateOfPr datetime,
             * status <datatype> ==> pending or recieved ...
             * ItemList IList<ActualPRItem> ==> ActualPRItem(){itemId int, orderQty float}*/

            /* ****NOTE :: if insertion successfully completed ==> CLEAR TEMPPR table*/
            /*ClearTempPRTable()*/

            return Json(new { /*isSuccess*/});
        }

        /***** new methods ******/
        public JsonResult AddPRItemsToInventory(IList<int> prId)
        {
            return Json(new { /*isSuccess*/});
        }

        public JsonResult AddIssueNote(int orderId /*orderId from the production manager*/)
        {
            /*update the order status sent by the production manager ( in order table 'IsRecieved' column)*/
            /*notify production manager to collect the inventories requested*/

            return Json(new { /*isSuccess*/});
        }
    }
}
