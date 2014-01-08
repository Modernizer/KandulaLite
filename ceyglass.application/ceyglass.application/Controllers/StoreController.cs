using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

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

        public ActionResult PendingGRN()
        {
            return View();
        }

        public ActionResult PendingFRN()
        {
            return View();
        }

        public JsonResult GetPendingRawMaterialRequests()
        {

            return Json(new { /*pending_req= .. (IList<RawmeterialRequest>).Where(RequestState pending)*/ });
        }


        public JsonResult GetRawMaterialRequestDetails(int requestId)
        {
            /*this requires a view model, following type of object list is required                * 
             * 'Id': 1, 
             * 'Name': 'dolamite', 
             * 'UOM': 'g', 
             * 'QtyRequested': 153575, 
             * 'AverageLeadTime': 20, 
             * 'MinimumInventoryLevel': 50000, 
             * 'AvailableInStocks': 150000 
             * 'TotalPendingPurchaseOrders':100000 //total pending orders to be recieved
             */

            /*tables required as i see,
             * 1. RawmeterialRequestDetail
             * 2. InventoryItem
             * 3. StockBalance
             * 4. PurchaseOrder & PurchaseOrderItem
             */

            return Json(new {/*details= .. view model*/ });
        }

        public JsonResult GetPendingRawMaterialRequestDetailsMappedToTotalPendingRequests(int requestId)
        {
            /*this requires a view model, following type of object list is required                * 
             * 'Id': 1, 
             * 'Name': 'dolamite', 
             * 'UOM': 'g', 
             * 'QtyRequested': 153575, 
             * 'AverageLeadTime': 20, 
             * 'MinimumInventoryLevel': 50000, 
             * 'AvailableInStocks': 150000,
             * 'TotalPendingRequestsQty':220000, // this is including the current item 'QtyRequested'
             * 'TotalPendingPurchaseOrders':100000 //total pending orders to be recieved
             */

            /*tables required as i see,
             * 1. RawmeterialRequestDetail
             * 2. InventoryItem
             * 3. StockBalance
             * 4. PurchaseOrder & PurchaseOrderItem
             */

            return Json(new {/*details= .. view model*/ });
        }

        public JsonResult AddIssueNote(int rawMaterialReqId)
        {
            /*update the 'RawmeterialRequest' RequestState  as 'Allocated'
             * update the inventory
             */
            /*notify production manager to collect the inventories requested*/

            return Json(new { /*isSuccess=.. (bool)*/});
        }

        public JsonResult AddToPurchasingCart(/*IList<PurchasingCart> purchasingCart*/)
        {
            /*
             * public class PurchasingCart
             * {
             *      public int Id {get;set;} // primary key
             *      public Guid OwnerId {get;set;} // current logged userId --> Membership.GetUser(true).ProviderUserKey
             *      [ForeignKey("InventryItem")]
             *      public int ItemId {get;set;}
             *      public long Qty {get;set;}
             * }
             */

            /*PurchasingCart contain only itemId and the qty of that item to be purchase, this table will be cleared as soon as
             total PR is confirmed and send to the purchasing department*/

            return Json(new { /*isSuccess =.. (bool) */});
        }

        public JsonResult GetPurchasingCartItems()
        {

            /*
             * //logged users cart items
             * Guid userId=(Guid)Membership.GetUser(true).ProviderUserKey;
             * IList<PurchasingCart_viewmodel> cartItems= (new BusinessLayer_Service()).GetCurrentUserPurchasingCartItems(userId);
             * above view model item should contain following properties,
             * 
             * ItemId ,
             * ItemName ,
             * CartQty, // sum of all qty in users cart matching to current item
             * UOM ,
             * AverageLeadTime,
             * MinimumInventoryLevel,
             * AvailableInStocks,
             * TotalPendingPurchaseOrders,
             * //below property is not required in this action but needed in 
             * //next action 'GetPurchasingCartItemsMappedWithTotalRawMaterialReqs()'
             * TotalPendingRequestsQty
             */

            return Json(new {/*cartItems= .. IList<PurchasingCart_viewmodel> */});
        }


        public JsonResult GetPurchasingCartItemsMappedWithTotalRawMaterialReqs()
        {
            /*
            * //logged users cart items
            * Guid userId=(Guid)Membership.GetUser(true).ProviderUserKey;
            * IList<PurchasingCart_viewmodel> cartItems= (new BusinessLayer_Service()).GetCurrentUserPurchasingCartItems(userId);
            * above view model item should contain following properties,
            * 
            * ItemId ,
            * ItemName ,
            * CartQty, // sum of all qty in users cart matching to current item
            * UOM ,
            * AverageLeadTime,
            * MinimumInventoryLevel,
            * AvailableInStocks,
            * TotalPendingPurchaseOrders,
            * TotalPendingRequestsQty
            */

            return Json(new {/*cartItems= .. IList<PurchasingCart_viewmodel> */});
        }

        public JsonResult AddPR(/*PurchaseRequsition pr*/)
        {

            /* ****NOTE :: if insertion successfully completed ==> CLEAR purchasing cart table items matching to current user*/
            /*ClearPurchasingCart(userId)*/

            return Json(new { /*isSuccess=.. (bool)*/});
        }

        public JsonResult GetPendingGRNs()
        {
            return Json(new { /*grns= (IList<InventoryTransaction>().where(TransactionType=GRN && TrasactionStatus=Pending)*/});
        }

        public JsonResult GetGrnDetails(int grnId)
        {
            /*
             * this should return a view model of InventoryTransactionItem , which contains
             * Id,Name,Qty,Price
             */
            return Json(new {/*grnItems=.. IList<InventoryTransactionItem_viewmodel>*/ });
        }

        public JsonResult ConfirmGRNList(/*IList<InventoryTransaction> grns*/)
        {
            /*
             * NOTE: the list returned from the javascript only contain the 'Id' parameter of 
             * each selected 'InventoryTransaction' item, use the 'Id' to set the 'TrasactionStatus' to 'Confirmed'
             * fianlly add inventory items to inventory
             */

            return Json(new { /*isSuccess=.. (bool)*/});
        }

        public JsonResult GetPendingFRNs()
        {
            return Json(new { /*frns= (IList<InventoryTransaction>().where(TransactionType=FRN && TrasactionStatus=Pending)*/});
        }

        public JsonResult GetFRNDetails(int frnId)
        {
            /*
             * this should return a view model of InventoryTransactionItem , which contains
             * Id,Name,Qty,Price
             */
            return Json(new {/*frnItems=.. IList<InventoryTransactionItem_viewmodel>*/ });
        }

        public JsonResult ConfirmFRNList(/*IList<InventoryTransaction> frns*/)
        {
            /*
             * NOTE: the list returned from the javascript only contain the 'Id' parameter of 
             * each selected 'InventoryTransaction' item, use the 'Id' to set the 'TrasactionStatus' to 'Confirmed'
             * fianlly add finish goods to inventory
             */

            return Json(new { /*isSuccess=.. (bool)*/});
        }

    }
}

