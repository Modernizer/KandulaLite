using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO;
using System.Linq;
using System.Configuration;
using System.Diagnostics;
using System.Data.Entity;
using SarandibNet.Data.Core;
using SarandibNet.Data;
using SarandibNet.Model;

using System.Web.Security;
using SerandibNet.SPA;
using SerandibNet.Model;





namespace SerandibNet.Test.Data
{
    [TestClass]
    public class UowFactoryTest : BaseDbIntegrationTest
    {
        
        private static UnitOfWork Uow { get; set; }

        [ClassInitialize]
        public static void Initialize(TestContext context)
        {
            //Configure the UowFactory to create a new database and seed sample data
            UowFactory.Configure(true, true);
            DeleteDbFile();
            //create the unit of work to be tested
            Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnection");
            
        }

        [ClassCleanup]
        public static void Cleanup()
        {
            Uow.Dispose();
        }

        /*
        [TestMethod]
        public void TestCrudProduct()
        {
            Product tester = new Product() { GUID = Guid.NewGuid(), Name = "Test DB Product", Price = 289, Category = "Hot" };
            crudEntity(tester);
        }
          
  

        [TestMethod]
        public void TestCrudSupplier()
        {
            Supplier tester = new Supplier() { GUID = Guid.NewGuid(), Name = "Test DB Supplier", Description = "Great for testing"};
            crudEntity(tester);
        }

        [TestMethod]
        public void TestCrudCustomers()
        {
            Customer customer = new Customer() { GUID = Guid.NewGuid(), CustomerName = "N1", Email = "a@b.com", Address = "a11", PhoneNo="dsdsds" };
            crudEntity(customer);
        }

                */


        [TestMethod]
        public void TestCrudDashboard()
        {
            Dashboard dashboard = new Dashboard() { GUID = Guid.NewGuid(), Name = "TestDashboard", };
            crudEntity(dashboard);
        }

        [TestMethod]
        public void TestCrudApplication() {
            Application app = new Application() { GUID = Guid.NewGuid(), Name = "MyApp1", ModifiedTime = DateTime.Now };
            crudEntity(app);
        }

        [TestMethod]
        public void TestCrudDashboardForUser(){
            DashboardForUser tester = new DashboardForUser() { GUID = Guid.NewGuid(), UserName = "1"};
            crudEntity(tester);
        }
        //[TestMethod]
        //public void TestCrudProject()
        //{
        //    Project tester = new Project() { GUID = Guid.NewGuid(),Name="SerNet", Client="Mr.X"};
        //    crudEntity(tester);
        //}

        //[TestMethod]
        //public void TestCrudStory()
        //{
        //    var repository = Uow.GetEntityRepository<Project>();
        //    Project proj = new Project() { GUID = Guid.NewGuid(), Name = "Auth", Client = "Mr.Y" };
        //    var inserted = repository.InsertOrUpdate(proj);
        //    Story tester = new Story() { GUID = Guid.NewGuid(), Name = "SerNet_Story_1", Project = repository.GetById(inserted.Id) };
        //    crudEntity(tester);
        //}

        //[TestMethod]
        //public void TestCrudTask()
        //{
        //    Task tester = new Task() { GUID = Guid.NewGuid(), Name = "SerNet_Task_1", StoryId=1 };
        //    crudEntity(tester);
        //}

        //[TestMethod]
        //public void TestCrudEmployee()
        //{
        //    var repository = Uow.GetEntityRepository<Project>();
        //    Project proj = new Project() { GUID = Guid.NewGuid(), Name = "Auth", Client = "Mr.Y" };
        //    var inserted = repository.InsertOrUpdate(proj);
        //    Employee tester = new Employee() { GUID = Guid.NewGuid(), Name = "Madhu", project=repository.GetById(inserted.Id)};
        //    crudEntity(tester);
        //}

        //[TestMethod]
        //public void TestCrudTaskProgress()
        //{
        //    TaskProgress tester = new TaskProgress() { GUID = Guid.NewGuid(), date = DateTime.Now, LinesOfCode = 300, TaskId=1 };
        //    crudEntity(tester);
        //}

        //[TestMethod]
        //public void TestCrudUnitTest()
        //{
        //    UnitTest tester = new UnitTest() { GUID = Guid.NewGuid(), date = DateTime.Now, automateCoverage = 5, manualCoverage = 40, TaskId=1 };
        //    crudEntity(tester);
        //}


        //[TestMethod]
        //public void TestCrudIntigrateTest()
        //{
        //    IntigrateTest tester = new IntigrateTest() { GUID = Guid.NewGuid(), date = DateTime.Now, automateCoverage = 30, manualCoverage = 40, StoryId=1 };
        //    crudEntity(tester);
        //}

        //[TestMethod]
        //public void TestCrudDemploymentTest()
        //{
        //    DeploymentTest tester = new DeploymentTest() { GUID = Guid.NewGuid(), date = DateTime.Now, automateCoverage = 5, manualCoverage = 40, ProjectId=1 };
        //    crudEntity(tester);
        //}

        private void crudEntity<T>(T tester) where T:class, IIdentifier, new()
        {
            var repository = Uow.GetEntityRepository<T>();
            //Insert
            var inserted = repository.InsertOrUpdate(tester);
            Uow.Commit();
            Assert.IsTrue(inserted.Id > 0);
            Assert.AreEqual(tester.GUID, inserted.GUID);

            //query GetAll
            var products = repository.GetAll();
            var retrieved = products.Where(p => p.GUID == tester.GUID).FirstOrDefault();
            Assert.AreEqual(tester.GUID, retrieved.GUID);

            
            //GetById
            var retrievedById = repository.GetById(inserted.Id);
            Assert.AreEqual(tester.GUID, retrievedById.GUID);

            //Update
            Guid newGuid = Guid.NewGuid();
            retrievedById.GUID = newGuid;
            repository.InsertOrUpdate(retrievedById);
            Uow.Commit();
            Assert.AreEqual(newGuid, repository.GetById(inserted.Id).GUID);

            ////Update
            //newGuid = Guid.NewGuid();
            //retrievedById.GUID = newGuid;
            //repository.Update(retrievedById);
            //Uow.Commit();
            //Assert.AreEqual(newGuid, repository.GetById(inserted.Id).GUID);

            ////Delete
            ////try detaching the object before deleting to ensure detached objects can be deleted
            //Uow.Context.ChangeObjectState(retrievedById, EntityState.Detached);
            //repository.Delete(retrievedById);
            //Uow.Commit();
            //retrievedById = repository.GetById(inserted.Id);
            //Assert.IsNull(retrievedById);


        }

        
    }
}
