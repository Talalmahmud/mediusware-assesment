import React, { useState, useEffect, useRef, useCallback } from "react";

const Problem2 = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEvenOnly, setShowEvenOnly] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);

  const fetchData = async (page) => {
    try {
      const response = await fetch(
        `https://contact.mediusware.com/api/contacts/?page=${page}`
      );
      const result = await response.json();
      setData((prevData) => [...prevData, ...result.results]);
      setHasMore(result.next !== null);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    let filtered = data;

    if (filter === "us") {
      filtered = filtered.filter(
        (item) => item.country.name === "United States"
      );
    }

    if (filter === "us" && showEvenOnly) {
      filtered = filtered.filter(
        (item) => item.country.name === "United States" && item.id % 2 === 0
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }

    if (showEvenOnly) {
      filtered = filtered.filter((item) => item.id % 2 === 0);
    }

    setFilteredData(filtered);
  }, [data, filter, searchTerm, showEvenOnly]);

  const handleFilterClick = (newFilter) => {
    setFilter(newFilter);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowEvenChange = () => {
    setShowEvenOnly(!showEvenOnly);
  };

  const openPhoneModal = (phoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    setPhoneModalVisible(true);
  };

  const closePhoneModal = () => {
    setSelectedPhoneNumber(null);
    setPhoneModalVisible(false);
  };

  const observer = useRef();
  const lastContactRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          setPageNumber((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mt-5">
        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-primary"
            type="button"
            onClick={toggleModal}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-warning"
            type="button"
            onClick={() => {
              toggleModal();
              handleFilterClick("us");
            }}
          >
            US Contacts
          </button>
        </div>
      </div>
      <div
        className={`modal fade ${modalVisible ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: modalVisible ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel">
                Modal A
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={toggleModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="col">
                <div className="col-md-6 mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by country name"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="row-md-6 mb-2">
                    {/* Adjusted column width to fit both buttons */}
                    <span className="me-2">
                      {/* Added margin-right class to space out the buttons */}
                      <button
                        className={`btn btn-primary ${
                          filter === "all" ? "active" : ""
                        }`}
                        onClick={() => handleFilterClick("all")}
                        type="button"
                      >
                        All Contacts
                      </button>
                    </span>
                    <span>
                      <button
                        className={`btn btn-warning ${
                          filter === "us" ? "active" : ""
                        }`}
                        onClick={() => handleFilterClick("us")}
                        type="button"
                      >
                        US Contacts
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <div className="overflow-auto" style={{ maxHeight: "400px" }}>
                <table className="table table-striped">
                  <thead className="sticky-top">
                    {/* Added sticky-top class */}
                    <tr>
                      <th>Serial No.</th>
                      <th>Phone</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => openPhoneModal(item.phone)}
                        style={{ cursor: "pointer" }}
                        ref={
                          index === filteredData.length - 1
                            ? lastContactRef
                            : null
                        }
                      >
                        <td>{index + 1}</td>
                        <td>{item.phone}</td>
                        <td>{item.country.name}</td>
                      </tr>
                    ))}
                    {loading && (
                      <tr>
                        <td colSpan="3">Loading...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-start">
              {" "}
              {/* Added flex utilities */}
              <div className="form-check">
                <input
                  style={{ cursor: "pointer" }}
                  type="checkbox"
                  className="form-check-input custom-checkbox"
                  id="showEven"
                  checked={showEvenOnly}
                  onChange={handleShowEvenChange}
                />
                <label className="form-check-label" htmlFor="showEven">
                  Only even
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Modal */}
      <div
        className={`modal ${phoneModalVisible ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: phoneModalVisible ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          {" "}
          {/* Added modal-dialog-centered */}
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel">
                Phone Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={closePhoneModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Phone Number: {selectedPhoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem2;
