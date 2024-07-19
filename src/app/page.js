const fs= require("fs");
import Link from "next/link";

const getCreators= ()=>{
  const creators = fs.readFileSync("./src/app/creators.json","utf8");
  return JSON.parse(creators);
}

export default async function Home(){
  let creators = getCreators();
  creators= Object.values(creators);
  return(
    <main className='container text-center'>
    <div className="row">
      <div className="main-col col d-flex flex-column justify-content-center">
        <div id="header">
          <h1>Only Content 🌚</h1>
          <p>Pay for 'exclusive' content from your favourite creators</p>
        </div>
        <Link href="/admin">
            <button className="btn btn-secondary m-4">Go to Admin Page</button>
          </Link>
        {creators && creators.length && creators.length>0 ?(
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Address</th>
                <th>Name</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {creators.map(creator =>(
                <tr key={creator.address}>
                  <td>{creator.address}</td>
                  <td>{creator.name}</td>
                  <td><a href={`/creators/${creator.address}`}>Link</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        ): null}
      </div>
    </div>
    </main>
  );
}