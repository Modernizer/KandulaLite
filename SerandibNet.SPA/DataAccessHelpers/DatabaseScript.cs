using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

using System.Configuration;
using System.Data.Entity;
using SarandibNet.Data.Core;
using SarandibNet.Data;
using SarandibNet.Model;

using System.Web.Security;
using SerandibNet.SPA;

using SerandibNet.Model.Entities;

namespace SerandibNet.SPA.DataAccessHelpers
{
    public  class DatabaseScript
    {
        private static UnitOfWork Uow { get; set; }

        public void populateDB() {
            Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            this.addApps();
            this.addDashboards();
            this.addUsers();
            this.addDashboardsForUsers();
        }

        public void addUsers()
        {
            //Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<AppUser>();

            AppUser tester = new AppUser() { GUID = Guid.NewGuid(), UserName = "NW_Admin" };
            //Insert
            var inserted = repository.InsertOrUpdate(tester);
            Uow.Commit();

            AppUser tester1 = new AppUser() { GUID = Guid.NewGuid(), UserName = "NW_ProdMgr" };
            //Insert
            var inserted1 = repository.InsertOrUpdate(tester1);
            Uow.Commit();

        }

        public void addApps()
        {
          //  Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<Application>();

            Application tester = new Application() { GUID = Guid.NewGuid(), Name = "app-editor", ModifiedTime = DateTime.Now };
            //Insert
            var inserted = repository.InsertOrUpdate(tester);
            Uow.Commit();



            Application tester1 = new Application() { GUID = Guid.NewGuid(), Name = "profileAdmin", ModifiedTime = DateTime.Now };
            //Insert
            var inserted1 = repository.InsertOrUpdate(tester1);
            Uow.Commit();

            Application tester2 = new Application() { GUID = Guid.NewGuid(), Name = "profileProdMgr", ModifiedTime = DateTime.Now };
            //Insert
            var inserted2 = repository.InsertOrUpdate(tester2);
            Uow.Commit();

            Application tester3 = new Application() { GUID = Guid.NewGuid(), Name = "AddUser", ModifiedTime = DateTime.Now };
            //Insert
            var inserted3 = repository.InsertOrUpdate(tester3);
            Uow.Commit();

            Application tester4 = new Application() { GUID = Guid.NewGuid(), Name = "contactsEditor", ModifiedTime = DateTime.Now };
            //Insert
            var inserted4 = repository.InsertOrUpdate(tester4);
            Uow.Commit();

            Application tester5 = new Application() { GUID = Guid.NewGuid(), Name = "AppDesigner", ModifiedTime = DateTime.Now };
            //Insert
            var inserted5 = repository.InsertOrUpdate(tester5);
            Uow.Commit();

            Application tester6 = new Application() { GUID = Guid.NewGuid(), Name = "DashboardDesigner", ModifiedTime = DateTime.Now };
            //Insert
            var inserted6 = repository.InsertOrUpdate(tester6);
            Uow.Commit();

            Application tester7 = new Application() { GUID = Guid.NewGuid(), Name = "QueryBuilder", ModifiedTime = DateTime.Now };
            //Insert
            var inserted7 = repository.InsertOrUpdate(tester7);
            Uow.Commit();

            Application tester8 = new Application() { GUID = Guid.NewGuid(), Name = "ChartDesigner", ModifiedTime = DateTime.Now };
            //Insert
            var inserted8 = repository.InsertOrUpdate(tester8);
            Uow.Commit();

            Application tester9 = new Application() { GUID = Guid.NewGuid(), Name = "productionPerform", ModifiedTime = DateTime.Now };
            //Insert
            var inserted9 = repository.InsertOrUpdate(tester9);
            Uow.Commit();

            Application tester10 = new Application() { GUID = Guid.NewGuid(), Name = "shoppingCart", ModifiedTime = DateTime.Now };
            //Insert
            var inserted10 = repository.InsertOrUpdate(tester10);
            Uow.Commit();

            Application tester11 = new Application() { GUID = Guid.NewGuid(), Name = "stockStatus", ModifiedTime = DateTime.Now };
            //Insert
            var inserted11 = repository.InsertOrUpdate(tester11);
            Uow.Commit();

        }
        public void addDashboards()
        {
           // Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<Dashboard>();
            var app_DBrepository = Uow.GetEntityRepository<SerandibNet.Model.ApplicationForDashboard>();
       
            //////////////////////////////////////////   
            Dashboard dashboard = new Dashboard() { GUID = Guid.NewGuid(), Name = "ProfileManager" };
               var inserted1 = repository.InsertOrUpdate(dashboard);
               Uow.Commit();

               SerandibNet.Model.ApplicationForDashboard ad1 = new SerandibNet.Model.ApplicationForDashboard() { GUID = Guid.NewGuid(),AppName="profileAdmin", dashboardName = "ProfileManager" };
               var i1 = app_DBrepository.InsertOrUpdate(ad1);
               Uow.Commit();

               SerandibNet.Model.ApplicationForDashboard ad2 = new SerandibNet.Model.ApplicationForDashboard() { GUID = Guid.NewGuid(), AppName = "contactsEditor", dashboardName = "ProfileManager" };
               var i2 = app_DBrepository.InsertOrUpdate(ad2);
               Uow.Commit();

            ////////////////////////////////////////
               Dashboard dashboard1 = new Dashboard() { GUID = Guid.NewGuid(), Name = "AdminTools" };
               var inserted11 = repository.InsertOrUpdate(dashboard1);
               Uow.Commit();

               SerandibNet.Model.ApplicationForDashboard ad3 = new SerandibNet.Model.ApplicationForDashboard() { GUID = Guid.NewGuid(), AppName = "AppDesigner", dashboardName = "AdminTools" };
               var i3 = app_DBrepository.InsertOrUpdate(ad3);
               Uow.Commit();

               SerandibNet.Model.ApplicationForDashboard ad4 = new SerandibNet.Model.ApplicationForDashboard() { GUID = Guid.NewGuid(), AppName = "DashboardDesigner", dashboardName = "AdminTools" };
               var i4 = app_DBrepository.InsertOrUpdate(ad4);
               Uow.Commit();

               SerandibNet.Model.ApplicationForDashboard ad5 = new SerandibNet.Model.ApplicationForDashboard() { GUID = Guid.NewGuid(), AppName = "addUser", dashboardName = "AdminTools" };
               var i5 = app_DBrepository.InsertOrUpdate(ad5);
               Uow.Commit();

            //////////////////////////////////////// 
            Dashboard dashboard2 = new Dashboard() { GUID = Guid.NewGuid(), Name = "DataTools" };
               var inserted12 = repository.InsertOrUpdate(dashboard2);
               Uow.Commit();

               SerandibNet.Model.ApplicationForDashboard ad6 = new SerandibNet.Model.ApplicationForDashboard() { GUID = Guid.NewGuid(), AppName = "QueryBuilder", dashboardName = "DataTools" };
               var i6 = app_DBrepository.InsertOrUpdate(ad6);
               Uow.Commit();

               SerandibNet.Model.ApplicationForDashboard ad7 = new SerandibNet.Model.ApplicationForDashboard() { GUID = Guid.NewGuid(), AppName = "ChartDesigner", dashboardName = "DataTools" };
               var i7 = app_DBrepository.InsertOrUpdate(ad7);
               Uow.Commit();

            /////////////////////////////
               Dashboard dashboard3 = new Dashboard() { GUID = Guid.NewGuid(), Name = "ProductionTools" };
               var inserted3= repository.InsertOrUpdate(dashboard3);
               Uow.Commit();

               SerandibNet.Model.ApplicationForDashboard ad8 = new SerandibNet.Model.ApplicationForDashboard() { GUID = Guid.NewGuid(), AppName = "productionPerform", dashboardName = "ProductionTools" };
               var i8 = app_DBrepository.InsertOrUpdate(ad8);
               Uow.Commit();

               SerandibNet.Model.ApplicationForDashboard ad9 = new SerandibNet.Model.ApplicationForDashboard() { GUID = Guid.NewGuid(), AppName = "ShoppingCart", dashboardName = "ProductionTools" };
               var i9 = app_DBrepository.InsertOrUpdate(ad9);
               Uow.Commit();

               SerandibNet.Model.ApplicationForDashboard ad10 = new SerandibNet.Model.ApplicationForDashboard() { GUID = Guid.NewGuid(), AppName = "StockStatus", dashboardName = "ProductionTools" };
               var i10 = app_DBrepository.InsertOrUpdate(ad10);
               Uow.Commit();
            
        }

        public void addDashboardsForUsers()
        {
           // Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
            var repository = Uow.GetEntityRepository<DashboardForUser>();

            DashboardForUser tester1 = new DashboardForUser() { GUID = Guid.NewGuid(), dashboardName = "ProfileManager", UserName = "NW_Admin" };
            //Insert
            var inserted1 = repository.InsertOrUpdate(tester1);
            Uow.Commit();

            DashboardForUser tester2 = new DashboardForUser() { GUID = Guid.NewGuid(), dashboardName = "ProfileManager", UserName = "NW_ProdMgr" };
            //Insert
            var inserted2 = repository.InsertOrUpdate(tester2);
            Uow.Commit();

            DashboardForUser tester3 = new DashboardForUser() { GUID = Guid.NewGuid(), dashboardName = "AdminTools", UserName = "NW_Admin" };
            //Insert
            var inserted3 = repository.InsertOrUpdate(tester3);
            Uow.Commit();

            DashboardForUser tester4 = new DashboardForUser() { GUID = Guid.NewGuid(), dashboardName = "DataTools", UserName = "NW_Admin" };
            //Insert
            var inserted4 = repository.InsertOrUpdate(tester4);
            Uow.Commit();

            DashboardForUser tester5 = new DashboardForUser() { GUID = Guid.NewGuid(), dashboardName = "DataTools", UserName = "NW_ProdMgr" };
            //Insert
            var inserted5 = repository.InsertOrUpdate(tester5);
            Uow.Commit();

            DashboardForUser tester6 = new DashboardForUser() { GUID = Guid.NewGuid(), dashboardName = "ProductionTools", UserName = "NW_ProdMgr" };
            //Insert
            var inserted6 = repository.InsertOrUpdate(tester6);
            Uow.Commit();
           
        }
    }
}