import "dotenv/config";
import { client, databaseId, studentContainerId, teacherContainerId } from './cosmosClient.js';

// Student CRUD operations
async function createStudent(student) {
  try {
    const container = client.database(databaseId).container(studentContainerId);
    const { resource: createdItem } = await container.items.create(student);
    console.log(`Created student with id: ${createdItem.id}`);
    return ` Student ${createdItem.firstName} created`
  } catch (error) {
    console.error("Error creating student:", error);
    return "error creating student"
  }
}

async function readStudent(id) {
  try {
    const container = client.database(databaseId).container(studentContainerId);
    const query = `SELECT * FROM c WHERE c.id = @id`;
    const parameters = [{ name: '@id', value: id }];
    
    const { resources: students } = await container.items.query({ query, parameters }).fetchAll();
    
    if (students.length === 0) {
      console.log(`No student found with id: ${id}`);
      return null;
    }
    
    console.log(`Retrieved student: ${JSON.stringify(students[0])}`);
    return students[0];
  } catch (error) {
    console.error("Error reading student:", error);
  }
}

async function updateStudent(student) {
  try {
    const container = client.database(databaseId).container(studentContainerId);

    // First, retrieve the current student document to ensure it exists
    const existingStudent = await readStudent(student.id);
    if (!existingStudent) {
      console.log(`Cannot update: No student found with id: ${student.id}`);
      return "student not found";
    }

    // Use the email as the partition key if you have it
    const partitionKey = existingStudent.email;

    const newStudent = { ...existingStudent, ...student };

    // Replace the existing student document
    const { resource: updatedItem } = await container.item(student.id, partitionKey).replace(newStudent);
    console.log(`Updated student with id: ${updatedItem.id}`);
    rerurn `Updated student with id: ${updatedItem.id}`;
  } catch (error) {
    console.error("Error updating student:", error);
    return "error updating student"
  }
}

async function deleteStudent(id) {
  try {
    const container = client.database(databaseId).container(studentContainerId);
    
    // First, retrieve the student document to ensure it exists
    const existingStudent = await readStudent(id);
    if (!existingStudent) {
      console.log(`Cannot delete: No student found with id: ${id}`);
      return `Cannot delete: No student found with id: ${id}`;
    }

    // Use the email from the existing student as the partition key
    const email = existingStudent.email;

    // Delete the student document
    await container.item(id, email).delete();
    console.log(`Deleted student with id: ${id}`);
    return `Deleted student with id: ${id}`
  } catch (error) {
    console.error("Error deleting student:", error);
    return "error deleting the student"
  }
}


async function listStudents() {
  const container = client.database(databaseId).container(studentContainerId);
  const { resources: students } = await container.items.readAll().fetchAll();
  console.log('Current students:', students);
  return JSON.stringify(students);
}

// Teacher CRUD operations
async function createTeacher(teacher) {
  try {
    const container = client.database(databaseId).container(teacherContainerId);
    const { resource: createdItem } = await container.items.create(teacher);
    console.log(`Created teacher with id: ${createdItem.id}`);
    return `Teacher ${createdItem.firstName} created`;
  } catch (error) {
    console.error("Error creating teacher:", error);
    return "error creating teacher"
 
  }
}

async function readTeacher(id) {
  try {
    const container = client.database(databaseId).container(teacherContainerId);
    const query = `SELECT * FROM c WHERE c.id = @id`;
    const parameters = [{ name: '@id', value: id }];
    
    const { resources: teachers } = await container.items.query({ query, parameters }).fetchAll();
    
    if (teachers.length === 0) {
      console.log(`No teacher found with id: ${id}`);
      return null;
    }
    
    console.log(`Retrieved teacher: ${JSON.stringify(teachers[0])}`);
    return teachers[0];
  } catch (error) {
    console.error("Error reading teacher:", error);
    return "can not find teacher"
  }
}

async function updateTeacher(teacher) {
  try {
    const container = client.database(databaseId).container(teacherContainerId);

    // First, retrieve the current teacher document to ensure it exists
    const existingTeacher = await readTeacher(teacher.id);
    if (!existingTeacher) {
      console.log(`Cannot update: No teacher found with id: ${teacher.id}`);
      return `Cannot update: No teacher found with id: ${teacher.id}` ;
    }

    // Use the email as the partition key
    const partitionKey = existingTeacher.email;

    const newTeacher = { ...existingTeacher, ...teacher };

    // Replace the existing teacher document
    const { resource: updatedItem } = await container.item(teacher.id, partitionKey).replace(newTeacher);
    console.log(`Updated teacher with id: ${updatedItem.id}`);
    return `Updated teacher with id: ${updatedItem.id}`
  } catch (error) {
    console.error("Error updating teacher:", error);
    return "error updating teacher"
  }
}


async function deleteTeacher(id) {
  try {
    const container = client.database(databaseId).container(teacherContainerId);
    
    // First, retrieve the teacher document to ensure it exists
    const existingTeacher = await readTeacher(id);
    if (!existingTeacher) {
      console.log(`Cannot delete: No teacher found with id: ${id}`);
      return `Cannot delete: No teacher found with id: ${id}`;
    }

    // Use the email from the existing teacher as the partition key
    const email = existingTeacher.email;

    // Delete the teacher document
    await container.item(id, email).delete();
    console.log(`Deleted teacher with id: ${id}`);
    return `Deleted teacher with id: ${id}`
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return "Error deleting teacher"
  }
}

async function listTeachers() {
  const container = client.database(databaseId).container(teacherContainerId);
  const { resources: teachers } = await container.items.readAll().fetchAll();
  console.log('Current teachers:', teachers);
  return JSON.stringify(teachers)
}

export {createStudent,deleteStudent,updateStudent,readStudent,listStudents , createTeacher,deleteTeacher,updateTeacher,listTeachers,readTeacher}