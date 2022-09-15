import { SlashCommandBuilder } from "discord.js";
import database from "../database.js";

let command = {
    data: new SlashCommandBuilder()
            .setName('hide')
            .setDescription('Hide an entry from the guestbook')
            .addIntegerOption(option =>
                option.setName('entry')
                    .setDescription("The entry you want to hide's ID")
                    .setRequired(true)
            ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        if(process.env.DISCORD_ADMIN_IDS.split(",").includes(interaction.user.id)) {
            let entry = interaction.options.getInteger('entry');
            let result = await database.query(`UPDATE ${process.env.MYSQL_TABLE} SET hidden = 1 WHERE id = ?`, [entry]);
            if (result.affectedRows > 0) {
                await interaction.editReply(`Entry ${entry} hidden`, { ephemeral: true });
            } else {
                await interaction.editReply(`Entry ${entry} not found`, { ephemeral: true });
            }
        } else {
            await interaction.editReply("You do not have permission to use this command", { ephemeral: true });
        }
    }
}

export default command;