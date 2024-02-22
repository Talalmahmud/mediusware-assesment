import React, { useState } from "react";

const Problem1 = () => {
  const [show, setShow] = useState("all");
  const [dataList, setDataList] = useState([]);
  const [showList, setShowList] = useState([]);

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const clickOnSubmit = (e) => {
    e.preventDefault();

    setDataList([...dataList, inputs]);
  };

  const handleClick = (val) => {
    setShow(val);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-1</h4>
        <div className="col-6 ">
          <form className="row gy-2 gx-3 align-items-center mb-4">
            <div className="col-auto">
              <input
                type="text"
                name="username"
                value={inputs.username || ""}
                onChange={handleChange}
                className="form-control"
                placeholder="Name"
              />
            </div>
            <div className="col-auto">
              <input
                type="text"
                name="status"
                value={inputs.status || ""}
                onChange={handleChange}
                className="form-control"
                placeholder="Status"
              />
            </div>
            <div className="col-auto">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={clickOnSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="col-8">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${show === "all" && "active"}`}
                type="button"
                onClick={() => handleClick("all")}
              >
                All
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "active" && "active"}`}
                type="button"
                onClick={() => handleClick("active")}
              >
                Active
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${show === "completed" && "active"}`}
                type="button"
                onClick={() => handleClick("completed")}
              >
                Completed
              </button>
            </li>
          </ul>
          <div className="tab-content"></div>
          <table className="table table-striped ">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {show === "all"
                ? dataList.map((item, index) => (
                    <tr key={index}>
                      <td>{item.username}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))
                : dataList.map((item, index) => {
                    if (item.status === show) {
                      return (
                        <tr key={index}>
                          <td>{item.username}</td>
                          <td>{item.status}</td>
                        </tr>
                      );
                    }
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problem1;
