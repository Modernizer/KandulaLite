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

        /*Merchandiser actions*/

        public JsonResult GetCustomerOrderStatusList()
        {
            /*return the CustomerOrderStatusEnum list as a object list Ex. 
                               * IList<CustomerOrderStatus>({Id=0,Status='confirm'},{Id=1,Status='SheduleForProduction'}....) */
            return Json(new { /*customerOrderStatusList= .. */});
        }

        /*NOTE: this same function is in CustomerController so can use the same method written in the business layer
         * to capture the customer list
         */
        public JsonResult GetAllCustomers()
        {
            return Json(new { /*customerList= .. IList<Customer>*/});
        }

        public JsonResult GetAllProducts()
        {
            /*
             * NOTE: here you need to get the product name from InventoryItem table since as we discused
             * Product table inherit from InventoryItem table
             * I think we need a view model here including the Name of the product
             * any way what required is 'Id','Name' and the 'unitprice' only
             */
            return Json(new {/*products= .. (Id,Name,Price)*/});
        }

        public JsonResult ManageOrder(/*CustomerOrder order*/)
        {
            /*can use the same method for add and edit , on edit mode order id will be passed through the object*/

            /*NOTE :: edit mode will not be considered in this context*/

            /*object from the javascript :
                  var order = {
                            'Id': $('#hf-orderId').val(), //this will be -1 if the order is a new item
                            'CustomerId': $('#select-customers option:selected').val(),
                            'OrderDate': $('#datepicker-orderdate').val(),
                            'DeliveryAddress': $('#txt-delivery-address').val(),
                            'EstimatedCost': parseInt($('#txt-quantity').val()) * parseInt($('#txt-unitprice').val()),
                            'RequiredDeliveryDate': $('#datepicker-duedate').val(),
                            'DeliveryInstructions': $('#txt-delivery-inst').val(),
                            'OrderDetails': {
                                'ProductId': $('#select-product option:selected').val(),
                                'RequiredQty': $('#txt-quantity').val()
                              }
                            };
             */

            /*NOTE :: set 'OrderStatues' (confirmed) property set to default values when setting an order
             * i have not passed those two values
             */

            /*bool isSuccess=false;
             * isSuccess=(new businesslayer_service()).ManageOrder(order);
             * if(isSuccess){ 
             *  //notify production manager saying that we have recived a new order  
             * }
             */

            return Json(new { /*isSuccess= isSuccess*/});
        }

        public JsonResult GetCustomerOrdersByStatus(int statusId)
        {
            /*
             * this should be a custome object containing below properties
             * OrderId,
               CustomerId,
               CustomerName,
               OrderDate, // .ToString("MM/dd/yyyy")
               ProductId, ProductName, RequiredQty, item.UnitPrice,AvailableQtyInStocks, 
                // since we assume that only one product can be in one order we can use product details in the same custom object that we
                //gonna use here
               RequiredDeliveryDate,
               DeliveryAddress,// .ToString("MM/dd/yyyy")
               DeliveryInstructions,
               OrderStatues            
             */
            return Json(new { /*Orders=IList<CustomerOrder> */});
        }

        /*end of Merchandiser actions*/

        /*production manager actions*/

        public JsonResult GetInternalCustomerId()
        {
            return Json(new { /*Id= .. */});
        }

        public JsonResult GetAllInventoryItems_RawMaterials()
        {
            return Json(new {/*items=.. (IList<InventoryItem>).where(Category is Raw Materials) */});
        }

        public JsonResult GetProductionPlants()
        {
            /*Plants object should contain following properties
             * Id int,
             * Name string,
             * IsLocal bit (0,1)
             */

            return Json(new { /*plants=.. (IList<Plants>).OrderByDescending(local plants to top of the list) */});
        }

        public JsonResult GetProductStructureOfProduct(int productId)
        {
            /*this required a custome object containing following => ('Id': 1, 'Name': 'dolamite', 'UOM': 'g', 'Quantity': 20.5)
             * this is a combination of 'ProductStructure' table and 'InventoryItem' table
             */
            return Json(new {/*product_struct= .. IList<Item>*/ });
        }

        public JsonResult AddProductionPlan(/*ProductionPlanning productionPlan*/)
        {
            /*in the above object does not contain the 'ProductionPlaningStatus' property set it to default*/

            /*
             * NOTE: make sure you reserve qty from 'StockBalance' as well if the production plan has requested 
             * items from stocks
             */

            return Json(new { /*isSuccess= .. (bool)*/});
        }

        public JsonResult AddRawMaterialRequest(/*RawmeterialRequest rawMaterialReq*/)
        {
            /*NOTE: set 'RequestState' to default (pending=0)*/

            /*
             * sample object you gonna get from javascript
             * var rawMaterialReq = {
                    'RequiredDate': $('#datepicker-production-sdate').val(),
                    'SpecialNotes': $('#txt-notes').val(),
                    'CustomerOrderId': $('#hf-cust-orderId').val(),
                    'rawmeterialRequestDetail': [
                        {'InventryItemId': $(item).attr('itemid'),'QtyRequested': request_amt},
                        {'InventryItemId': $(item).attr('itemid'),'QtyRequested': request_amt}
                    ]
                };
             */

            /*bool isSuccess=false;
            * isSuccess=(new businesslayer_service()).AddRawMaterialRequest(rawMaterialReq);
            * if(isSuccess){ 
            *  //notify store manager saying that we raw marerial request has been placed 
            * }
            */

            return Json(new {/*isSuccess= isSuccess*/ });
        }

        public JsonResult AddOrdersToFinishGoodsInventory(/*IList<CustomerOrder> order*/)
        {
            /*please note that this IList<CustomerOrder> order only consists of the 'Id' property other properties will be null
             * get the customer order Ids and procceed with the rest
             * 
             * Set customer order status to 'ProductionComplete' & add a FRN (InventoryTransaction)
             */

            /*
             * on successful insertion notify merchandiser (to inform the client) as well as store manager 
             * (to collect it from the production department)
             */
            return Json(new { /*isSuccess= .. (bool)*/});
        }

        /*end of production manager actions*/
    }
}
