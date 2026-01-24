require "test_helper"

class Customer::BookingsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get customer_bookings_index_url
    assert_response :success
  end

  test "should get show" do
    get customer_bookings_show_url
    assert_response :success
  end
end
