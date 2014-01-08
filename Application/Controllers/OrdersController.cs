using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ceyglass.application.Controllers
{
    public class OrdersController : Controller
    {
        //
        // GET: /Orders/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetAllCustomers()
        {
            return Json(new { /*'customerID' & the 'customerName' will be enough here just need to fill a combo box*/});
        }

        public JsonResult GetAllProducts()
        {
            return Json(new {/*productID, ProductName, UnitPrice*/});
        }

        public JsonResult GetAllItems()
        {
            return Json(new {/*itemID, itemName, UOM*/});
        }

        public JsonResult GetBOM(int itemId)
        {
            return Json(new { /*IList<bom> --> sample =>'id': 1, 'item': 'dolamite', 'UOM': 'g', 'qty': 20.5*/});
        }

        /*order object definition*/
        /*this will be used by both ProductionManager & the Merchandiser*/
        /*            
            * OrderId int,
            * OrderDate datetime,
            * CustomerId int,
            * CustomerName string,
            * ProductId int,
            * ProductName string,
            * OrderQty int,
            * UnitPrice float,
            * DiliveryDate datetime,
            * DiliveryInstructions string?
            * Description string?
            * OrderStatus string 
            */

        /*note: the same order object will be assigned by new properties when it is at ProductionManager's screen*/

        /*
         * IsOrderd bit, (from stores)
         * IsRecieved bit (from stores)
         */

        /*unique to procuction manager*/
        /*set as soon as order is completed*/
        /*
         * IsCompleted bit
         */

        public JsonResult AddEditOrderByMerchandiser(/*Order Object*/)
        {
            /*can use the same method for add and edit , on edit mode order id will be passed through the object*/
            return Json(new { /*isSuccess*/});
        }

        public JsonResult GetOrderById(int orderId)
        {
            return Json(new { /*order object*/});
        }

        public JsonResult GetAllOrders()
        {
            return Json(new { /*order_list=IList<Order> */});
        }

        public JsonResult AddInventoryOrder()
        {
            /*
             * id int,
             * productionStartDate datetime,
             * itemQty IList<ItemQty> ==> {itemId int, qty float}
             * orders IList<int> ==> this refers to which orders this inventory is ordered may be this has to be kept in a middle table
             *                          and once the inventory recieved automatically status of order will be updated as recieved
             * specialNotes string?,
             * Status <datatype> ==> may be we can use 'P' for pending or something like that
             */

            /***** newly added part *****/

            /*
             * update order table 'IsOrderd' column by mentioning that the selected order is ordered from stores
             */

            return Json(new { });
        }

        public JsonResult GetSumOfBOMsOfSelectedProducts(IList<int> productIds)
        {
            /*this equires a view model containing, Total BOM required for the orders selected by the production manager
                sample=>
             *  'id': id,
                'item': itemName,
                'qty': (qtyRequiredForAProduct * requestedQtyByOrder),
                'uom': UOM
            */

            return Json(new {/*list of bom items including the total of each item required by the selected orders*/ });
        }

        public JsonResult AddOrdersToFinishGoodsInventory(IList<int> orderId)
        {
            /*
             * on successful insertion notify merchandiser (to inform the client) as well as store manager 
             * (to collect it from the production department)
             */
            return Json(new { /*isSuccess*/});
        }
    }
}
