require "test_helper"

class Merchant::ReportsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get merchant_reports_index_url
    assert_response :success
  end
end
