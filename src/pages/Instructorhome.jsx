import InstructorNavbar from "../components/InstructorNavbar";

const Instructorhome = () => {
    return ( 
        <div className="instructor-home">
            <h1>Welcome to Instructor Dashboard</h1>
            <InstructorNavbar/>
            {/* Add more instructor-specific content here */}
        </div>
     );
}
 
export default Instructorhome;