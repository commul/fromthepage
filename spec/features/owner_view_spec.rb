require 'spec_helper'

#describe "owner views" do
describe "owner views" do

  before :all do

    @owner = User.find_by(login: OWNER)
    @collections = @owner.all_owner_collections
    @collection = @collections.first
    @works = @owner.owner_works
  end

  before :each do
    login_as(@owner, :scope => :user)
  end    

  it "looks at owner tabs" do
    visit dashboard_owner_path
    page.find('.tabs').click_link("Start A Project")
    expect(page.current_path).to eq '/dashboard/startproject'
    expect(page).to have_content("Upload PDF or ZIP File")
    page.find('.tabs').click_link("Your Works")
    expect(page.current_path).to eq dashboard_owner_path
  end

  it "looks at subjects tab" do
    visit "/collection/show?collection_id=#{@collection.id}"
    page.find('.tabs').click_link("Subjects")
    expect(page).to have_content("Categories")
    expect(page).to have_content("People")
    expect(page).to have_content("Places")
  end

  it "looks at statistics tab" do
    visit "/collection/show?collection_id=#{@collection.id}"
    page.find('.tabs').click_link("Statistics")
    expect(page).to have_content("Works")
    expect(page).to have_content("Work Progress")
    @collections.first.works.each do |w|
      expect(page).to have_content(w.title)
    end
    #need to check actual stats
    #wording is checked in needs review and archive import
  end

  it "looks at settings tab" do
    visit "/collection/show?collection_id=#{@collection.id}"
    page.find('.tabs').click_link("Settings")
    expect(page).to have_content(@collection.title)
    expect(page).to have_content("Manage Works")
    @collections.first.works.each do |w|
      expect(page).to have_content(w.title)
    end
  end

  it "looks at export tab" do
    visit "/collection/show?collection_id=#{@collection.id}"
    page.find('.tabs').click_link("Export")
    expect(page).to have_content(@collection.title)
    expect(page).to have_content("Export Subject Index")
    expect(page).to have_content("Export Individual Works")
    @collections.first.works.each do |w|
      expect(page).to have_content(w.title)
    end
  end
=begin
  it "looks at collaborators tab" do
    visit "/collection/show?collection_id=#{@collection.id}"
    page.find('.tabs').click_link("Collaborators")
    expect(page).to have_content(@collection.title)
    expect(page).to have_content("Contributions Between")
    expect(page).to have_content("All Collaborators")
  end
=end
end