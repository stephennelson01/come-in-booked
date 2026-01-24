require "test_helper"

class Merchant::ServicesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get merchant_services_index_url
    assert_response :success
  end
end
