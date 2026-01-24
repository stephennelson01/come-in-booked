require "test_helper"

class Merchant::ClientsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get merchant_clients_index_url
    assert_response :success
  end
end
