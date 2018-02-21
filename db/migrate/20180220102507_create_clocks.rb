class CreateClocks < ActiveRecord::Migration[5.1]
  def change
    create_table :clocks do |t|

      t.string :place_id, null: false
      t.string :name, null: false
      t.string :formatted_name, null: false
      t.string :lat, null: false
      t.string :lon, null: false
      t.string :map_url, null: false
      t.integer :user_id, null: false

      t.timestamps
    end
  end
end
