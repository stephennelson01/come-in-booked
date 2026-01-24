require "test_helper"

class Merchant::StaffControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get merchant_staff_index_url
    assert_response :success
  end
end
