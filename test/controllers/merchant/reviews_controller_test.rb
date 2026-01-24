require "test_helper"

class Merchant::ReviewsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get merchant_reviews_index_url
    assert_response :success
  end
end
