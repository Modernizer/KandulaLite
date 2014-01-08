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
using SarandibNet.Model.Entities;
using System.Web.Security;
using SerandibNet.SPA;
using SerandibNet.Model;
using SerandibNet.Model.Entities;



namespace SerandibNet.Test.Data
{
    [TestClass]
    public class AppDbTest: BaseDbIntegrationTest
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
        [TestMethod]
        public void TestAppDb()
        {
            /*
            var proj_repository = Uow.GetEntityRepository<Project>();
            var Story_repo = Uow.GetEntityRepository<Story>();
            var Employ_repo = Uow.GetEntityRepository<Employee>();
            var Component_repo = Uow.GetEntityRepository<Component>();
            var Task_repo = Uow.GetEntityRepository<Task>();
            var Progress_repo = Uow.GetEntityRepository<TaskProgress>();
            var Unit_trepo = Uow.GetEntityRepository<UnitTest>();
            var Intigrate_trepo = Uow.GetEntityRepository<IntigrateTest>();
            var Deploy_trepo = Uow.GetEntityRepository<DeploymentTest>();
            var Product_rep = Uow.GetEntityRepository<SoftwareProduct>();
            var TimeEntry_repo = Uow.GetEntityRepository<TimeEntry>();

            SoftwareProduct product = new SoftwareProduct() { GUID = Guid.NewGuid(), Name = "Auth", Client="Mr.client" };
            var inserted_prod = Product_rep.InsertOrUpdate(product);

            Story story = new Story() { GUID = Guid.NewGuid(), Name = "SerNet_Story_1", SoftwareProduct = Product_rep.GetById(inserted_prod.Id) };
            var inserted_story = Story_repo.InsertOrUpdate(story);

            Employee employ = new Employee() { GUID = Guid.NewGuid(), Name = "Madhu" };
            var inserted_epmloy = Employ_repo.InsertOrUpdate(employ);

            Component comp = new Component() { GUID = Guid.NewGuid(), Name = "SerNet_COMP_1", theStory = Story_repo.GetById(inserted_story.Id) };
            var inserted_comp = Component_repo.InsertOrUpdate(comp);


            Task task = new Task() { GUID = Guid.NewGuid(), Name = "SerNet_Task_1", theComponents = Component_repo.GetById(inserted_comp.Id) };
            var inserted_task = Task_repo.InsertOrUpdate(task);

            TaskProgress progress = new TaskProgress() { GUID = Guid.NewGuid(), date = DateTime.Now, LinesOfCode = 300, theTask = Task_repo.GetById(inserted_task.Id) };
            var inserted_progress = Progress_repo.InsertOrUpdate(progress);

            UnitTest unit = new UnitTest() { GUID = Guid.NewGuid(), date = DateTime.Now, automateCoverage = 5, manualCoverage = 40, theTask = Task_repo.GetById(inserted_task.Id) };
            var inserted_unit = Unit_trepo.InsertOrUpdate(unit);

            IntigrateTest intigrate = new IntigrateTest() { GUID = Guid.NewGuid(), date = DateTime.Now, automateCoverage = 30, manualCoverage = 40, theStory = Story_repo.GetById(inserted_story.Id) };
            var inserted_intgrt = Intigrate_trepo.InsertOrUpdate(intigrate);

            DeploymentTest deploy = new DeploymentTest() { GUID = Guid.NewGuid(), date = DateTime.Now, automateCoverage = 5, manualCoverage = 40, theProject = proj_repository.GetById(inserted_prod.Id) };
            var inserted_deploy = Deploy_trepo.InsertOrUpdate(deploy);

            Project proj = new Project() { GUID = Guid.NewGuid(), Name = "Auth_proj",TimeEstimation=200 };
            var inserted_proj = proj_repository.InsertOrUpdate(proj);

           TimeEntry timeEntry = new TimeEntry() { GUID = Guid.NewGuid(), date = DateTime.Now, EffortHrs = 4, employee = Employ_repo.GetById(inserted_epmloy.Id), project = proj_repository.GetById(inserted_proj.Id), theTask = Task_repo.GetById(inserted_task.Id) };
           var inserted_TimeEntry = TimeEntry_repo.InsertOrUpdate(timeEntry);
            */
        }
    }
}
