require "test_helper"

class BusinessesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get businesses_index_url
    assert_response :success
  end

  test "should get new" do
    get businesses_new_url
    assert_response :success
  end

  test "should get create" do
    get businesses_create_url
    assert_response :success
  end

  test "should get show" do
    get businesses_show_url
    assert_response :success
  end
end
