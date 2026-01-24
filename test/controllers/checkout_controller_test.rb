require "test_helper"

class CheckoutControllerTest < ActionDispatch::IntegrationTest
  test "should get start" do
    get checkout_start_url
    assert_response :success
  end

  test "should get details" do
    get checkout_details_url
    assert_response :success
  end

  test "should get payment" do
    get checkout_payment_url
    assert_response :success
  end

  test "should get success" do
    get checkout_success_url
    assert_response :success
  end
end
