//using SarandibNet.Data;
//using SarandibNet.Data.Core;
//using SarandibNet.Model;
//using SerandibNet.Model;
//using SerandibNet.Model.Entities;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;

//namespace SerandibNet.SPA.DataAccessHelpers
//{
//    /*
//    public class SerandibDBContext
//    {
//        public UnitOfWork Uow { get; set; }

//        private static SerandibDBContext instance;

//        private SerandibDBContext() { }

//        public static SerandibDBContext Instance
//        {
//            get
//            {
//                if (instance == null)
//                {
//                    instance = new SerandibDBContext();
//                    instance.Uow = (UnitOfWork)UowFactory.CreateUnitOfWork("DefaultConnectionServer");
//                }

//                return instance;
//            }
//        }

//        public static UnitOfWork getUow()
//        {
//            UnitOfWork Uow = SerandibDBContext.Instance.Uow;
//            return Uow;
//        }


//        public void addUsers()
//        {
//            UnitOfWork Uow = SerandibDBContext.Instance.Uow;
//            var repository = Uow.GetEntityRepository<User>();

//            User tester = new User() { GUID = Guid.NewGuid(), UserName = "samudra" };
//            //Insert
//            var inserted = repository.InsertOrUpdate(tester);
//            Uow.Commit();

//            User tester1 = new User() { GUID = Guid.NewGuid(), UserName = "ravini" };
//            //Insert
//            var inserted1 = repository.InsertOrUpdate(tester1);
//            Uow.Commit();

//            User tester2 = new User() { GUID = Guid.NewGuid(), UserName = "samudra1" };
//            //Insert
//            var inserted2 = repository.InsertOrUpdate(tester2);
//            Uow.Commit();

//            User tester3 = new User() { GUID = Guid.NewGuid(), UserName = "madhu" };
//            //Insert
//            var inserted3 = repository.InsertOrUpdate(tester3);
//            Uow.Commit();

//        }

//        public static bool initDataBase()
//        {
//            UnitOfWork Uow = SerandibDBContext.Instance.Uow;

//            var proj_repository = Uow.GetEntityRepository<Project>();
//            var Story_repo = Uow.GetEntityRepository<Feature>();
//            var Employ_repo = Uow.GetEntityRepository<Employee>();
//            var Component_repo = Uow.GetEntityRepository<Component>();
//            var Task_repo = Uow.GetEntityRepository<Task>();
//            var Progress_repo = Uow.GetEntityRepository<TaskProgress>();
//            var Unit_trepo = Uow.GetEntityRepository<UnitTest>();
//            var Intigrate_trepo = Uow.GetEntityRepository<IntigrateTest>();
//            var Deploy_trepo = Uow.GetEntityRepository<DeploymentTest>();
//            var Product_rep = Uow.GetEntityRepository<SoftwareProduct>();
//            var TimeEntry_repo = Uow.GetEntityRepository<TimeEntry>();
//            var Comp_prog_repo = Uow.GetEntityRepository<ComponentProgress>();
//            var Comp_Exe_prog = Uow.GetEntityRepository<ComponentExecution>();

//            SoftwareProduct product1 = new SoftwareProduct() { GUID = Guid.NewGuid(), Name = "ProductA", Client = "Mr.client1" };
//            var inserted_prod1 = Product_rep.InsertOrUpdate(product1);
//            Project proj1 = new Project() { GUID = Guid.NewGuid(), Name = "ProjectA", TimeEstimation = 200 };
//            var inserted_proj1 = proj_repository.InsertOrUpdate(proj1);
//            Uow.Commit();

//            SoftwareProduct product2 = new SoftwareProduct() { GUID = Guid.NewGuid(), Name = "ProductB", Client = "Mr.client2" };
//            var inserted_prod2 = Product_rep.InsertOrUpdate(product2);
//            Project proj2 = new Project() { GUID = Guid.NewGuid(), Name = "ProjectB", TimeEstimation = 400 };
//            var inserted_proj2 = proj_repository.InsertOrUpdate(proj2);
//            Uow.Commit();

//            // *****************************
//            Feature story1 = new Feature() { GUID = Guid.NewGuid(), Name = "featureA1", SoftwareProduct = Product_rep.GetById(1), Completed = false };
//            var inserted_story1 = Story_repo.InsertOrUpdate(story1);
//            Uow.Commit();

//            Feature story2 = new Feature() { GUID = Guid.NewGuid(), Name = "featureA2", SoftwareProduct = Product_rep.GetById(1), Completed = false };
//            var inserted_story2 = Story_repo.InsertOrUpdate(story2);
//            Uow.Commit();

//            Feature story3 = new Feature() { GUID = Guid.NewGuid(), Name = "featureB1", SoftwareProduct = Product_rep.GetById(2), Completed = false };
//            var inserted_story3 = Story_repo.InsertOrUpdate(story3);
//            Uow.Commit();

//            Feature story4 = new Feature() { GUID = Guid.NewGuid(), Name = "featureB2", SoftwareProduct = Product_rep.GetById(2), Completed = false };
//            var inserted_story4 = Story_repo.InsertOrUpdate(story4);
//            Uow.Commit();

//            //*********************************************
//            Component comp1 = new Component() { GUID = Guid.NewGuid(), Name = "A1A", Feature = Story_repo.GetById(1) };
//            var inserted_comp1 = Component_repo.InsertOrUpdate(comp1);
//            Task task1 = new Task() { GUID = Guid.NewGuid(), Name = "A1A", theComponents = Component_repo.GetById(1) };
//            var inserted_task1 = Task_repo.InsertOrUpdate(task1);
//            Uow.Commit();

//            Component comp2 = new Component() { GUID = Guid.NewGuid(), Name = "A1B", Feature = Story_repo.GetById(1) };
//            var inserted_comp2 = Component_repo.InsertOrUpdate(comp2);
//            Task task2 = new Task() { GUID = Guid.NewGuid(), Name = "A1B", theComponents = Component_repo.GetById(2) };
//            var inserted_task2 = Task_repo.InsertOrUpdate(task2);
//            Uow.Commit();

//            Component comp3 = new Component() { GUID = Guid.NewGuid(), Name = "A2A", Feature = Story_repo.GetById(2) };
//            var inserted_comp3 = Component_repo.InsertOrUpdate(comp3);
//            Task task3 = new Task() { GUID = Guid.NewGuid(), Name = "A2A", theComponents = Component_repo.GetById(3) };
//            var inserted_task3 = Task_repo.InsertOrUpdate(task3);
//            Uow.Commit();

//            Component comp4 = new Component() { GUID = Guid.NewGuid(), Name = "A2B", Feature = Story_repo.GetById(2) };
//            var inserted_comp4 = Component_repo.InsertOrUpdate(comp4);
//            Task task4 = new Task() { GUID = Guid.NewGuid(), Name = "A2B", theComponents = Component_repo.GetById(4) };
//            var inserted_task4 = Task_repo.InsertOrUpdate(task4);
//            Uow.Commit();

//            Component comp5 = new Component() { GUID = Guid.NewGuid(), Name = "B1A", Feature = Story_repo.GetById(3) };
//            var inserted_comp5 = Component_repo.InsertOrUpdate(comp5);
//            Task task5 = new Task() { GUID = Guid.NewGuid(), Name = "B1A", theComponents = Component_repo.GetById(5) };
//            var inserted_task5 = Task_repo.InsertOrUpdate(task5);
//            Uow.Commit();

//            Component comp6 = new Component() { GUID = Guid.NewGuid(), Name = "B1B", Feature = Story_repo.GetById(3) };
//            var inserted_comp6 = Component_repo.InsertOrUpdate(comp6);
//            Task task6 = new Task() { GUID = Guid.NewGuid(), Name = "B1B", theComponents = Component_repo.GetById(6) };
//            var inserted_task6 = Task_repo.InsertOrUpdate(task6);
//            Uow.Commit();

//            Component comp7 = new Component() { GUID = Guid.NewGuid(), Name = "B2A", Feature = Story_repo.GetById(4) };
//            var inserted_comp7 = Component_repo.InsertOrUpdate(comp7);
//            Task task7 = new Task() { GUID = Guid.NewGuid(), Name = "B2A", theComponents = Component_repo.GetById(7) };
//            var inserted_task7 = Task_repo.InsertOrUpdate(task7);
//            Uow.Commit();

//            Component comp8 = new Component() { GUID = Guid.NewGuid(), Name = "B2B", Feature = Story_repo.GetById(4) };
//            var inserted_comp8 = Component_repo.InsertOrUpdate(comp8);
//            Task task8 = new Task() { GUID = Guid.NewGuid(), Name = "B2B", theComponents = Component_repo.GetById(8) };
//            var inserted_task8 = Task_repo.InsertOrUpdate(task8);
//            Uow.Commit();


//            for (int i = 1; i <= 14; i++)
//            {
//                String name = "Employee" + i.ToString();
//                Employee employ = new Employee() { GUID = Guid.NewGuid(), Name = name };
//                var inserted_epmloy = Employ_repo.InsertOrUpdate(employ);
//                Uow.Commit();
//            }

//            string[] components = { "A1A", "A1B", "A2A", "A2B", "B1A", "B1B", "B2A", "B2B" };
//            DateTime startDate = DateTime.Today;
//            var r = new Random();
//            int loc = 0;
//            int uTest = 50;
//            for (int i = 1; i <= 8; i++)
//            {
//                loc = loc + r.Next(10) * 50;  //line of codes
//                int total_test_run = 0;
//                int test_per_day = 0;
//                for (int j = 1; j <= 10; j++)
//                {
//                    ComponentProgress cp = new ComponentProgress { GUID = Guid.NewGuid(), Component = Component_repo.GetById(i), date = startDate.AddDays(i - 1), LinesOfCode = loc, porgress = (loc / 5000) * 100, UnittestCoverage = uTest + r.Next(50) };
//                    var inserted_comp_progress = Comp_prog_repo.InsertOrUpdate(cp);
//                    ComponentExecution ce = new ComponentExecution { GUID = Guid.NewGuid(), Component = Component_repo.GetById(i), date = startDate.AddDays(i - 1), TestRunPerDay = r.Next(15), TotalUnitTestRun = total_test_run + test_per_day };
//                    var inserted_comp_Exe = Comp_prog_repo.InsertOrUpdate(cp);
//                    UnitTest unit = new UnitTest() { GUID = Guid.NewGuid(), date = DateTime.Now, automateCoverage = uTest + r.Next(50), manualCoverage = uTest + r.Next(50), theTask = Task_repo.GetById(i) };
//                    var inserted_unit = Unit_trepo.InsertOrUpdate(unit);

//                    Uow.Commit();
//                }
//            }

//            return true;
//        }

//        //public static bool initDataBase()
//        //{
//            /*
//            UnitOfWork Uow = SerandibDBContext.Instance.Uow;

//            var proj_repository = Uow.GetEntityRepository<Project>();
//            var Story_repo = Uow.GetEntityRepository<Story>();
//            var Employ_repo = Uow.GetEntityRepository<Employee>();
//            var Component_repo = Uow.GetEntityRepository<Component>();
//            var Task_repo = Uow.GetEntityRepository<Task>();
//            var Progress_repo = Uow.GetEntityRepository<TaskProgress>();
//            var Unit_trepo = Uow.GetEntityRepository<UnitTest>();
//            var Intigrate_trepo = Uow.GetEntityRepository<IntigrateTest>();
//            var Deploy_trepo = Uow.GetEntityRepository<DeploymentTest>();
//            var Product_rep = Uow.GetEntityRepository<SoftwareProduct>();
//            var TimeEntry_repo = Uow.GetEntityRepository<TimeEntry>();

//            SoftwareProduct product = new SoftwareProduct() { GUID = Guid.NewGuid(), Name = "Auth", Client = "Mr.client" };
//            var inserted_prod = Product_rep.InsertOrUpdate(product);

//            Story story = new Story() { GUID = Guid.NewGuid(), Name = "SerNet_Story_1", SoftwareProduct = Product_rep.GetById(inserted_prod.Id) };
//            var inserted_story = Story_repo.InsertOrUpdate(story);

//            Employee employ = new Employee() { GUID = Guid.NewGuid(), Name = "Madhu" };
//            var inserted_epmloy = Employ_repo.InsertOrUpdate(employ);

//            Component comp = new Component() { GUID = Guid.NewGuid(), Name = "SerNet_COMP_1", theStory = Story_repo.GetById(inserted_story.Id) };
//            var inserted_comp = Component_repo.InsertOrUpdate(comp);


//            Task task = new Task() { GUID = Guid.NewGuid(), Name = "SerNet_Task_1", theComponents = Component_repo.GetById(inserted_comp.Id) };
//            var inserted_task = Task_repo.InsertOrUpdate(task);

//            TaskProgress progress = new TaskProgress() { GUID = Guid.NewGuid(), date = DateTime.Now, LinesOfCode = 300, theTask = Task_repo.GetById(inserted_task.Id) };
//            var inserted_progress = Progress_repo.InsertOrUpdate(progress);

//            UnitTest unit = new UnitTest() { GUID = Guid.NewGuid(), date = DateTime.Now, automateCoverage = 5, manualCoverage = 40, theTask = Task_repo.GetById(inserted_task.Id) };
//            var inserted_unit = Unit_trepo.InsertOrUpdate(unit);

//            IntigrateTest intigrate = new IntigrateTest() { GUID = Guid.NewGuid(), date = DateTime.Now, automateCoverage = 30, manualCoverage = 40, theStory = Story_repo.GetById(inserted_story.Id) };
//            var inserted_intgrt = Intigrate_trepo.InsertOrUpdate(intigrate);

//            DeploymentTest deploy = new DeploymentTest() { GUID = Guid.NewGuid(), date = DateTime.Now, automateCoverage = 5, manualCoverage = 40, theProject = proj_repository.GetById(inserted_prod.Id) };
//            var inserted_deploy = Deploy_trepo.InsertOrUpdate(deploy);

//            Project proj = new Project() { GUID = Guid.NewGuid(), Name = "Auth_proj", TimeEstimation = 200 };
//            var inserted_proj = proj_repository.InsertOrUpdate(proj);

//            TimeEntry timeEntry = new TimeEntry() { GUID = Guid.NewGuid(), date = DateTime.Now, EffortHrs = 4, employee = Employ_repo.GetById(inserted_epmloy.Id), project = proj_repository.GetById(inserted_proj.Id), theTask = Task_repo.GetById(inserted_task.Id) };
//            var inserted_TimeEntry = TimeEntry_repo.InsertOrUpdate(timeEntry);
//            */
//          //  return true;
//        //}
//    }
//}