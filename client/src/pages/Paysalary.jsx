import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { UserContext } from '../UserContext';

export default function VolunteerPayment() {
  const { id } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const { user } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  // Volunteer Payment Details State
  const [paymentDetails, setPaymentDetails] = useState({
    volunteerName: '',
    email: '',
    userid: '',
    amount: '',
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const [payment, setPayment] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!id) return;
    axios.get(`/volunteer/${id}`).then((response) => {
      setVolunteer(response.data);
      setPaymentDetails((prevDetails) => ({
        ...prevDetails,
        volunteerName: response.data.name,
        email: response.data.email,
        userid: response.data.userid
      }));
    }).catch((error) => {
      console.error("Error fetching volunteer details:", error);
    });
  }, [id]);

  if (!volunteer) return '';

  const handleChangePaymentDetails = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleChangePayment = (e) => {
    const { name, value } = e.target;
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
  };

  const makePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/volunteer/${id}/payment`, {
        paymentDetails,
      });
      alert("Payment Successful!");
      setRedirect(true);
      console.log("Payment recorded for volunteer:", response.data);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  if (redirect) {
    return <Navigate to={'/admin-dashboard/volunteer-salary'} />;
  }

  return (
    <>
      <div>
        <Link to={'/admin-dashboard/volunteer-salary'}>
          <button className='inline-flex mt-12 gap-2 p-3 ml-12 bg-gray-100 justify-center items-center text-blue-700 font-bold rounded-sm'>
            <IoMdArrowBack className='font-bold w-6 h-6 gap-2' /> Back
          </button>
        </Link>
      </div>

      <div className="ml-12 bg-gray-100 shadow-lg mt-8 p-16 w-3/5 float-left">
        {/* Volunteer Payment Details */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold mb-4">Volunteer Payment Details</h2>
          <input
            type="text"
            name="volunteerName"
            value={paymentDetails.volunteerName}
            onChange={handleChangePaymentDetails}
            placeholder="Volunteer Name"
            className="input-field ml-10 w-80 h-10 bg-gray-50 border border-gray-30 rounded-md p-2.5"
          />
          <input
            type="email"
            name="email"
            value={paymentDetails.email}
            onChange={handleChangePaymentDetails}
            placeholder="Email"
            className="input-field w-80 ml-3 h-10 bg-gray-50 border border-gray-30 rounded-sm p-2.5"
          />
          <input
            type="number"
            name="amount"
            value={paymentDetails.amount}
            onChange={handleChangePaymentDetails}
            placeholder="Payment Amount (LKR)"
            className="input-field ml-10 w-80 h-10 bg-gray-50 border border-gray-30 rounded-sm p-2.5"
          />
        </div>

        {/* Payment Information */}
        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-bold mb-4">Payment Information</h2>
          <div className="ml-10">
            <button type="button" className="px-8 py-3 text-black bg-blue-100 focus:outline border rounded-sm border-gray-300" disabled>
              Credit / Debit Card
            </button>
          </div>
          <input
            type="text"
            name="nameOnCard"
            value={payment.nameOnCard}
            onChange={handleChangePayment}
            placeholder="Name on Card"
            className="input-field w-80 ml-10 h-10 bg-gray-50 border border-gray-30 rounded-sm p-2.5"
          />
          <input
            type="text"
            name="cardNumber"
            value={payment.cardNumber}
            onChange={handleChangePayment}
            placeholder="Card Number"
            className="input-field w-80 ml-3 h-10 bg-gray-50 border border-gray-30 rounded-sm p-2.5"
          />
          <div className="flex space-x-4">
            <input
              type="text"
              name="expiryDate"
              value={payment.expiryDate}
              onChange={handleChangePayment}
              placeholder="Expiry Date (MM/YY)"
              className="input-field w-60 ml-10 h-10 bg-gray-50 border border-gray-30 rounded-sm p-2.5"
            />
            <input
              type="text"
              name="cvv"
              value={payment.cvv}
              onChange={handleChangePayment}
              placeholder="CVV"
              className="input-field w-16 h-10 bg-gray-50 border border-gray-30 rounded-sm p-3"
            />
          </div>
          <div className="float-right">
            <p className="text-sm font-semibold pb-2 pt-8">Total: LKR {paymentDetails.amount}</p>
            <button type="button" onClick={makePayment} className="primary">
              Confirm Payment
            </button>
          </div>
        </div>
      </div>

      <div className="float-right bg-blue-100 w-1/4 p-5 mt-8 mr-12">
        <h2 className="text-xl font-bold mb-8">Payment Summary</h2>
        <div className="space-y-1">
          <p className="text-lg font-semibold">{volunteer.name}</p>
          <p className="text-xs">Payment Date: {paymentDetails.paymentDate}</p>
          <hr className="my-2 border-t pt-2 border-gray-400" />
          <p className="float-right font-bold">LKR {paymentDetails.amount}</p>
          <p className="font-bold">Amount: LKR {paymentDetails.amount}</p>
        </div>
      </div>
    </>
  );
}
