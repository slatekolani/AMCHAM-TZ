<?php

namespace Database\Seeders;

use App\Models\BoardMember;
use Illuminate\Database\Seeder;

class BoardMemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            ['Benedict Busunzu', 'Board Chairman | CEO, Tembo Nickel Corporation Limited', 'benedict-busunzu.jpg'],
            ['Ebonie Mbeteni', 'Vice President | CEO (Founder), Duteni / Duteni Tours', 'ebonie-mbeteni.jpg'],
            ['Godfrey Mondi', 'Executive Director', 'godfrey-mondi.jpg'],
            ['Scott Karren', 'Board Member | Founder & CEO, Avaeo', 'scott-karren.jpg'],
            ['Desmond Mushi', 'Public Policy Manager for East and Horn of Africa, Meta Inc.', 'desmond-mushi.jpg'],
            ['Carlton Jones', 'Board Member | Partner, Deloitte (Retired)', 'carlton-jones.jpeg'],
            ['Imelda Lutebinga', 'Board Member | Country Director, DHL Tanzania', 'imelda-lutebinga.jpg'],
            ['Michelle Kilpin', 'Board Member | Managing Director, TBL Plc', 'michelle-kilpin.jpg'],
            ['Zainab Salome Msimbe', 'Board Member | Senior Country Partner, PwC Tanzania', 'zainab-msimbe.jpg'],
            ['Simon Shayo', 'Board Member | Vice President, AngloGold Ashanti', 'simon-shayo.jpg'],
            ['Yesaya Jackson', 'Board Member | Vice President, Apex Resources Limited', 'yesaya-jackson.jpg'],
        ];

        foreach ($members as $index => [$name, $role, $photo]) {
            BoardMember::updateOrCreate(['name' => $name], [
                'role_title' => $role,
                'photo_path' => "/images/board-members/{$photo}",
                'sort_order' => $index + 1,
                'is_active' => true,
            ]);
        }
    }
}
